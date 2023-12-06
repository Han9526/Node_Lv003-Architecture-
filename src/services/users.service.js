// src/services/posts.service.js

import { UsersRepository } from "../repositories/users.repository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export class UsersService {
  usersRepository = new UsersRepository();
  // 회원가입
  // controller에서 body값을 가져옴 -완-
  // 1. body값중 description빼고 null값 찾기 -완-
  // 2. password passwordRe 값이 같은지 다른지 확인 -완-

  // 3. email형식이 맞는지 아닌지 확인
  // 4. body값 중 공백이 있는지 확인  description제외
  createUser = async (name, email, password, passwordRe, description) => {
    try {
      if (!name || !email || !password || !passwordRe) {
        throw new Error("값을 모두 입력해라");
      }
      if (password !== passwordRe) {
        throw new Error("입력한 비밀번호가 다름");
      }
      const isExistUser = await this.usersRepository.findUserByEmail(email);
      if (isExistUser) {
        throw new Error("이미 존재하는 email 입니다");
      }
      const sortPassword = await bcrypt.hash(password, 11);
      const createdUser = await this.usersRepository.createUser(
        name,
        email,
        sortPassword,
        description
      );

      return createdUser;
    } catch (error) {
      throw error;
    }
  };

  //   로그인
  findUser = async (email, password, res, next) => {
    try {
      if (!email || !password) {
        throw new Error("값을 모두 입력해라");
      }
      const isExistUser = await this.usersRepository.findUserByEmail(email);
      if (!isExistUser) {
        throw new Error("존재하는 않는 email 입니다");
      }
      const userData = await this.usersRepository.findUser(email, password);
      if (userData) {
        const accessToken = jwt.sign(
          { userId: userData.userId },
          process.env.ACCESS_SECRET_KEY,
          {
            expiresIn: "2h",
          }
        );
        const refreshToken = jwt.sign(
          { userId: userData.userId },
          process.env.REFRESH_SECRET_KEY,
          {
            expiresIn: "2D",
          }
        );
        res.cookie("accessToken", accessToken);
        res.cookie("refreshToken", refreshToken);
        return userData;
      } else {
        throw new Error("비밀번호가 틀렸습니다");
      }
    } catch (error) {
      next(error);
    }
  };

  //   내정보 조회
  findUserById = async (userId, next) => {
    try {
      const userData = await this.usersRepository.findUserById(userId);
      if (!userData) {
        throw new Error("뭔가잘못됬어");
      }
      return userData;
    } catch (error) {
      next(error);
    }
  };

  //   내정보 수정
  updateUser = async (name, email, description, password, userId, next) => {
    try {
      const editUser = await this.usersRepository.updateUser(
        name,
        email,
        description,
        password,
        userId
      );
      return editUser;
    } catch (error) {
      next(error);
    }
  };

  // 회원 탈퇴
  deleteUser = async (password, userId, next) => {
    try {
      const deleteUser = await this.usersRepository.deleteUser(
        password,
        userId
      );
      return deleteUser;
    } catch (error) {
      next(error);
    }
  };
}
