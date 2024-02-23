import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/prisma";
import { CustomError } from "../utils/customError";

import { GeneralValidations } from "../validations/validations";
import { Validations } from "../validations/product.validation";
import {
  AdvancedFilter,
  FilterModel,
  SortModel,
} from "../service/filter.service";
import { getPagenation } from "../service/pagenation.service";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, filter, limit, order } =
      await Validations.ProductFilterValidations(req.query);

    const data = new AdvancedFilter().createFilter({
      limit,
      page,
      filter: filter as FilterModel[],
      sort: order as SortModel[],
    });
    console.log(data.orderBy);
    const produtcsCount = await prisma.product.count({
      where: {
        ...data.where,
      },
      // orderBy: {
      //   ...data.orderBy,
      // },
    });

    const pagenation = await getPagenation(page, limit, produtcsCount);

    const products = await prisma.product.findMany({
      where: {
        ...data.where,
      },
      ...pagenation.db,
      // orderBy: {
      //   ...data.orderBy,
      // },
    });

    res.status(200).json({
      pagenation: pagenation.meta,
      data: products,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getOneProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = await GeneralValidations.paramsMongoIdValidation(req.params.id);
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });
    if (!product) {
      throw new CustomError("Product not found", 404);
    }
    res.status(200).json({
      data: product,
      message: "Product found",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = await GeneralValidations.paramsMongoIdValidation(req.params.id);
    const data = await Validations.ProductUpdateValidations(req.body);

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: { ...data },
    });
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = await GeneralValidations.paramsMongoIdValidation(req.params.id);
    const product = await prisma.product.delete({
      where: {
        id,
      },
    });
    res.status(204).json(product);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
