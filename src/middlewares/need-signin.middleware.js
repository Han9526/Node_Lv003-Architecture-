// src/middlewares/auth.middleware.js

import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma/index.js';
import dotenv from 'dotenv';
dotenv.config();

export default async function (req, res, next) {
   try {
      const { accessToken } = req.cookies;

      if (!accessToken) throw new Error('토큰이 존재하지 않습니다.');

      const decodedToken = jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY);

      const userId = decodedToken.userId;

      const user = await prisma.Users.findFirst({
         where: { userId: +userId },
      });

      res.locals.user = user.userId;

      next();
   } catch (error) {
      next(error);
   }
}
