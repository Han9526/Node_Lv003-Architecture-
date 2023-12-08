// src/services/posts.service.js

import { UsersRepository } from "../repositories/users.repository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export class UsersService {
  usersRepository = new UsersRepository();

  // 회원가입
  createUser = async (name, email, password, passwordRe, description) => {
    try {
      const isExistUser = await this.usersRepository.findUserByEmail(email);
      if (isExistUser) {
        throw new Error("이미 존재하는 email 입니다");
      }
      const sortPassword = await bcrypt.hash(
        password,
        Number.parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS)
      );
      const createdUser = await this.usersRepository.createUser(
        name,
        email,
        sortPassword,
        description
      );
      const filterUser = {
        userId: createdUser.userId,
        name: createdUser.name,
        email: createdUser.email,
        description: createdUser.description,
      };
      return filterUser;
    } catch (error) {
      throw error;
    }
  };

  //   로그인
  findUser = async (email, password, res) => {
    try {
      if (!email || !password) {
        throw new Error("값을 모두 입력해라");
      }
      const isExistUser = await this.usersRepository.findUserByEmail(email);
      if (!isExistUser) {
        throw new Error("존재하는 않는 email 입니다");
      }

      const isSame = await bcrypt.compare(password, isExistUser.password);
      if (!isSame) {
        throw new Error("비밀번호가 틀렸습니다");
      }

      const accessToken = jwt.sign(
        { userId: isExistUser.userId },
        process.env.ACCESS_SECRET_KEY,
        {
          expiresIn: process.env.ACCESS_EXPIRATION_TIME,
        }
      );
      const refreshToken = jwt.sign(
        { userId: isExistUser.userId },
        process.env.REFRESH_SECRET_KEY,
        {
          expiresIn: process.env.REFRESH_EXPIRATION_TIME,
        }
      );
      res.cookie("accessToken", accessToken);
      res.cookie("refreshToken", refreshToken);
      const filterUser = {
        userId: isExistUser.userId,
        name: isExistUser.name,
        email: isExistUser.email,
        description: isExistUser.description,
      };
      return filterUser;
    } catch (error) {
      throw error;
    }
  };
  //  로그아웃
  signOut = async (res) => {
    try {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return "성공적으로 로그아웃";
    } catch (error) {
      throw error;
    }
  };
  //   내정보 조회
  findUserById = async (res, userId) => {
    try {
      const tokenId = res.locals.user;
      if (tokenId !== userId * 1) {
        throw new Error("권한 없음");
      }
      const userData = await this.usersRepository.findUserById(userId);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  // 회원 탈퇴
  deleteUser = async (res, password, userId) => {
    try {
      if (!password) {
        throw new Error("값을 모두 입력해라");
      }
      const tokenId = res.locals.user;
      if (tokenId !== 1 * userId) {
        throw new Error("수정할 권한이 없슴");
      }
      const findUserById = await this.usersRepository.findUserById(userId);
      if (!findUserById) {
        throw new Error("관리자 문의");
      }
      const isSame = await bcrypt.compare(password, findUserById.password);
      if (!isSame) {
        throw new Error("비밀번호가 틀렸습니다");
      }
      const deleteUser = await this.usersRepository.deleteUser(
        findUserById.userId
      );
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      const filterUser = {
        userId: deleteUser.userId,
        name: deleteUser.name,
        email: deleteUser.email,
        description: deleteUser.description,
      };
      return filterUser;
    } catch (error) {
      throw error;
    }
  };
}
