import Joi from "joi";
import { CustomError } from "../utils/customError";

export class Validations {
  static async ProductFilterValidations(data: any) {
    return Joi.object({
      limit: Joi.number().min(5).max(100).default(10),
      page: Joi.number().min(1).default(1),
      order: Joi.array()
        .items(
          Joi.object({
            column: Joi.string().required(),
            value: Joi.string().valid("asc", "desc").required(),
          })
        )
        .default([
          {
            column: "created_at",
            value: "desc",
          },
        ]),
      filter: Joi.array().items(
        Joi.object({
          column: Joi.string().required(),
          value: Joi.string().required(),
        })
      ),
    }).validateAsync(data);
  }
  static async ProductUpdateValidations(data: any) {
    return Joi.object({
      name: Joi.string(),
      price: Joi.number(),
      description: Joi.string(),
      image: Joi.string(),
    }).validateAsync(data);
  }
}
