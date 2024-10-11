import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import AppDataSource from '../config/data-source';
import {
  APIResponse, CommentDTO, CommentResponseDTO, CreatePostDTO,
  JwtPayload, PostResponseDTO, UserDetails,
} from '../dto/dto';
import { APIException } from '../exceptions/exception';
import { Post } from '../entity/post.entity';
import { Comment } from '../entity/comment.entity';
import { FIND_ALL_USER } from '../constants/queries';

export class UserService{
  private userRepo: Repository<User>;
  private postRepo: Repository<Post>;
  private commentRepo: Repository<Comment>;

  constructor() {
    this.userRepo = AppDataSource.manager.getRepository(User);
    this.postRepo = AppDataSource.manager.getRepository(Post);
    this.commentRepo = AppDataSource.manager.getRepository(Comment);
  }

  createPost = async (req: CreatePostDTO, user: JwtPayload, id: number) => {
    console.log("USER ID: " + id);
    const newPost = {
      title: req.title,
      content: req.content,
      user: await this.getUserById(id)
    };
    const createdPost: Post = await this.postRepo.save(newPost)
      .catch(err=>{
        console.error("Error while saving: ", err);
        throw new APIException(err.message, 500);
      })
    const resp: APIResponse<PostResponseDTO> = {
      statusCode: 201,
      message: 'Post created successfully',
      data: {
        id: createdPost.id,
        title: createdPost.title,
        content: createdPost.content,
        createdAt: createdPost.createdAt,
        updatedAt: createdPost.updatedAt,
        author: await this.getUserById(user.userId),
        comments: await this.getCommentsByPostId(createdPost.id),
      }
    };
    return resp;
  };


  getAllUsers = async () => {
    const users =  await AppDataSource.manager.query(FIND_ALL_USER)
      .then(res=>{
        return res.map((user: User)=>{
          const userResp: UserDetails = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          };
          console.log(userResp);
          return userResp;
        })
      })
      .catch(err=>{
        console.error("Error while fetching: ", err);
        throw new APIException(err.message, 500);
      });
    const resp: APIResponse<UserDetails> = {
      statusCode: 200,
      message: 'All users fetched successfully',
      data: users
    };
    return resp;
  };


  makeComment = async (req: CommentDTO, user: JwtPayload, postId: number) => {
    const existingPost: Post = await this.postRepo.findOneBy({
      id: postId
    });
    const commentAuthor: User = await this.userRepo.findOneBy({
      id: user.userId
    });
    const newComment: Comment = {
      content: req.content,
      post: existingPost,
      author: commentAuthor
    };
    const createdComment: Comment = await this.commentRepo.save(newComment)
     .catch(err=>{
        console.error("Error while saving: ", err);
        throw new APIException(err.message, 500);
      })
    const resp: APIResponse<CommentResponseDTO> = {
      statusCode: 201,
      message: 'Comment created successfully',
      data: {
        id: createdComment.id,
        content: createdComment.content,
        postId: postId,
        createdAt: createdComment.createdAt,
        updatedAt: createdComment.updatedAt,
      }
    };
    return resp;
  };

  private getUserById = async (userId: number): Promise<UserDetails> => {
    return await this.userRepo.findOneBy({
      id: userId
    })
      .then(res=>{
        const userResp: UserDetails = {
          id: res.id,
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email
        };
        return userResp;
      })
      .catch(err=>{
        console.error("Error while fetching: ", err);
        throw new APIException(err.message, 500);
      });
  }

  private getCommentsByPostId = async (postId: number) : Promise<CommentResponseDTO[]> => {
    return await this.commentRepo.findBy({
      id: postId
    })
      .then(res=>{
        return res.map(comment=>{
          const commentResp: CommentResponseDTO = {
            id: comment.id,
            content: comment.content,
            postId: postId,
            createdAt: comment.createdAt,
            updatedAt: comment.updatedAt
          };
          return commentResp;
        })
      })
      .catch(err=>{
        console.error("Error while fetching: ", err);
        throw new APIException(err.message, 500);
      });
  }
  getUserPosts = async(userId: number)=> {
    console.log("Getting posts for user: ", userId);
    const data =  await this.postRepo.createQueryBuilder("post")
      .innerJoinAndSelect("post.user", "user")
      .innerJoinAndSelect("post.comments","comments")
      .where("user.id = :userId", { userId })
      .getMany()
      .then((res)=>{
        const ps= res.map(async(p)=>{
          const post: PostResponseDTO = {
            id: p.id,
            title: p.title,
            content: p.content,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            comments: await this.getCommentsByPostId(p.id),
            author: await this.getUserById(userId)
          };
          console.log("POST: ",post);
          return post;
        });
        return Promise.all(ps);
      })
     .catch(err=>{
        console.error("Error while fetching: ", err);
        throw new APIException(err.message, 500);
      });
    const resp: APIResponse<PostResponseDTO[]> = {
      statusCode: 200,
      message: "Post fetched successfully",
      data: data
    }
    return resp;

}
}