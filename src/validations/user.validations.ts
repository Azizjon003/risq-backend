import Joi from "joi";
import { CustomError } from "../utils/customError";

export class Validations {
  static async createUserValidation(data: any) {
    return await Joi.object({
      name: Joi.string().required(),
      phone: Joi.string()
        .regex(/^9989[012345789][0-9]{7}$/)
        .required()
        .error(new CustomError("Phone number is not valid", 400)),
    }).validateAsync(data);
  }
}
