import {
  APIResponse,
  JwtPayload,
  LoginDTO,
  LoginResponseDto,
  LogoutDTO,
  SignupDTO,
  SignupResponseDto,
} from '../dto/dto';
import AppDataSource from '../config/data-source';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { generateToken, isValidToken } from '../middleware/validate.middleware';
import { deleteValue, getValue, setValue } from '../config/redis.config';
import { APIException } from '../exceptions/exception';

export class AuthService {
  private repo: Repository<User>;

  constructor() {
    this.repo = AppDataSource.manager.getRepository(User);
  }

  register = async (req: SignupDTO) => {
    const existingUser = await this.repo.findOneBy({
      email: req.email,
    })   .catch(err => {
      console.log("Error occurred: ",err);
    });
    if (existingUser != null) {
      throw new APIException('Email already exists', 409);
    }

    const newUser: User = {
      password: bcrypt.hashSync(req.password, 10),
      firstName: req.firstName,
      lastName: req.lastName,
      email: req.email
    }
    const user: User | void = await this.repo.save(newUser)
      .catch(err => {
        console.log("Error occurred: ",err);
        throw new APIException(err.message, 409);
      });
    let signupResponseDTO: SignupResponseDto  = null;
    if (user instanceof User) {
      signupResponseDTO = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    }
    const resp: APIResponse<SignupResponseDto>  = {
      statusCode: 201,
      message: 'User created successfully',
      data: signupResponseDTO
    };
    return resp;
  };


  login = async (req: LoginDTO) => {
    const existingUser = await this.repo.findOneBy({
      email: req.email,
    });
    if (existingUser == null) {
      throw new APIException('User not found', 404);
    }
    const passwordMatches = await bcrypt.compare(req.password, existingUser.password);
    if (!passwordMatches) {
      throw new APIException('Invalid password', 401);
    }
    const jwtPayload: JwtPayload = {
      userId: existingUser.id,
      email: existingUser.email
    };
    const token = generateToken(jwtPayload);
    await setValue(token, JSON.stringify(jwtPayload));
    const loginResponseDTO: LoginResponseDto = {
      id: existingUser.id,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      email: existingUser.email,
      token: token,
      createdAt: existingUser.createdAt,
      updatedAt: existingUser.updatedAt,
    }
    const resp: APIResponse<LoginResponseDto>  = {
      statusCode: 201,
      message: 'User created successfully',
      data: loginResponseDTO
    };
    return resp;
  };


  logout = async (req: LogoutDTO) => {
    if(!req.token){
      throw new APIException('Token not provided', 401);
    }
    if (!isValidToken(req.token)){
      throw new APIException('Invalid token', 400);
    }
    const jwtPayload = await getValue(req.token);
    if (jwtPayload == null) {
      throw new APIException('Invalid token', 400);
    }
    await deleteValue(req.token);
    const resp: APIResponse<string> = {
      statusCode: 200,
      message: 'User logged out successfully',
      data: 'User logged out successfully'
    }
    return resp;
  };
}