import Joi from "joi";

export class GeneralValidations {
  static async paramsMongoIdValidation(data: any) {
    return await Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .required()
      .validateAsync(data);
  }
}
