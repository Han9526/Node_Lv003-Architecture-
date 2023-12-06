// src/middlewares/auth.middleware.js

import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma/index.js";
import dotenv from "dotenv";
dotenv.config();

export default async function (req, res, next) {
  try {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken) throw new Error("토큰이 존재하지 않습니다.");

    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY);

    const userId = decodedToken.userId;

    const user = await prisma.Users.findFirst({
      where: { userId: +userId },
    });
    if (!user) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      throw new Error("토큰 사용자가 존재하지 않습니다.");
    }

    res.locals.user = user.userId;
    console.log(
      "🚀 ~ file: need-signin.middleware.js:28 ~ res.locals.user :",
      res.locals.user
    );

    next();
  } catch (error) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // 토큰이 만료되었거나, 조작되었을 때, 에러 메시지를 다르게 출력합니다.
    switch (error.name) {
      case "TokenExpiredError":
        return res.status(401).json({ message: "토큰이 만료되었습니다." });
      case "JsonWebTokenError":
        return res.status(401).json({ message: "토큰이 조작되었습니다." });
      default:
        return res
          .status(401)
          .json({ message: error.message ?? "비정상적인 요청입니다." });
    }
  }
}
