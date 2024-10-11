export class APIException extends Error{
  public error: string;
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'APIException';
    this.statusCode = statusCode;
    this.message = message;
    this.error = (new Error()).stack;
    Object.setPrototypeOf(this, APIException.prototype);
  }
}