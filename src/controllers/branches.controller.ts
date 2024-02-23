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

export const getBranches = async (
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

    const branchesCount = await prisma.branch.count({
      where: {
        ...data.where,
      },
    });

    const pagenation = await getPagenation(page, limit, branchesCount);

    const branches = await prisma.branch.findMany({
      where: {
        ...data.where,
      },
      ...pagenation.db,
      orderBy: {
        ...data.orderBy,
      },
    });

    res.status(200).json({
      pagenation: pagenation.meta,
      data: branches,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getOneBranch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const branch = await prisma.branch.findUnique({
      where: {
        id: id as string,
      },
    });

    if (!branch) {
      throw new CustomError("Branch not found", 404);
    }

    res.status(200).json({
      data: branch,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getOrderBranches = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = await GeneralValidations.paramsMongoIdValidation(req.params.id);
    const { page, filter, limit, order } =
      await Validations.ProductFilterValidations(req.query);

    const data = new AdvancedFilter().createFilter({
      limit,
      page,
      filter: filter as FilterModel[],
      sort: order as SortModel[],
    });
    const branches = await prisma.branch.findMany({
      where: {
        id: id,
      },
    });

    if (!branches) {
      throw new CustomError("Branch not found", 404);
    }
    const ordersCount = await prisma.order.count({
      where: {
        branchId: id,
        ...data.where,
      },
    });
    const pagenation = await getPagenation(page, limit, ordersCount);

    const orders = await prisma.order.findMany({
      where: {
        branchId: id,
        ...data.where,
      },
      include: {
        orderProducts: true,
        branch: true,
        user: true,
      },
      ...pagenation.db,
    });

    res.status(200).json({
      data: orders,
      pagenation: pagenation.meta,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getOrderProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = await GeneralValidations.paramsMongoIdValidation(req.params.id);
    const { page, filter, limit, order } =
      await Validations.ProductFilterValidations(req.query);

    const data = new AdvancedFilter().createFilter({
      limit,
      page,
      filter: filter as FilterModel[],
      sort: order as SortModel[],
    });
    const orders = await prisma.order.findMany({
      where: {
        id: id,
      },
    });

    const orderProductsCount = await prisma.orderProducts.count({
      where: {
        order_id: id,
        ...data.where,
      },
    });

    const pagenation = await getPagenation(page, limit, orderProductsCount);

    const orderProducts = await prisma.orderProducts.findMany({
      where: {
        order_id: id,
        ...data.where,
      },
      include: {
        product: true,
      },
      ...pagenation.db,
    });

    res.status(200).json({
      data: orderProducts,
      pagenation: pagenation.meta,
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};
