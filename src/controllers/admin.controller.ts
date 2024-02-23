import { NextFunction, Request, RequestHandler, Response } from "express";
import prisma from "../../prisma/prisma";
import { genereteToken } from "../service/jwt.service";

export const loginUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { username, password }: any = req.body;
    console.log(username, password);

    const user: any = await prisma.admin.findFirst({
      where: { username },
    });

    if (!user) {
      throw new Error("User not found");
    }
    if (user.password !== password) {
      throw new Error("Password not correct");
    }

    const token = await genereteToken({
      session_id: user.id,
    });

    return res.status(200).json({
      token: token,
      user: {
        ...user,
        password: null,
      },
    });
  } catch (error) {
    console.log(error);

    next(error);
  }
};

export const getMe: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = req.session;
    const user = {
      fullName: "Admin",
      phone: session?.username,
    };

    res.status(200).json({
      data: user,
      message: "User profile",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
