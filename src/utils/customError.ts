export class CustomError extends Error {
  statusCode: number;

  constructor(message: any, statusCode: number) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
