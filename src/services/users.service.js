// src/services/posts.service.js

import { UsersRepository } from '../repositories/users.repository.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

export class UsersService {
   usersRepository = new UsersRepository();

   // 회원가입
   createUser = async (name, email, password, description) => {
      const isExistUser = await this.usersRepository.findUserByEmail(email);
      if (isExistUser) {
         throw new Error('이미 존재하는 email 입니다');
      }
      const sortPassword = await bcrypt.hash(password, Number.parseInt(process.env.PASSWORD_HASH_SALT_ROUNDS));
      const createdUser = await this.usersRepository.createUser(name, email, sortPassword, description);
      const filterUser = {
         userId: createdUser.userId,
         name: createdUser.name,
         email: createdUser.email,
         description: createdUser.description,
      };
      return filterUser;
   };

   //   로그인
   findUser = async (email, password, res) => {
      if (!email || !password) {
         throw new Error('입력값이 모두 필요합니다.');
      }
      const isExistUser = await this.usersRepository.findUserByEmail(email);
      if (!isExistUser) {
         throw new Error('존재하는 않는 email 입니다');
      }

      const isSame = await bcrypt.compare(password, isExistUser.password);
      if (!isSame) {
         throw new Error('비밀번호가 틀렸습니다');
      }

      const accessToken = jwt.sign({ userId: isExistUser.userId }, process.env.ACCESS_SECRET_KEY, {
         expiresIn: process.env.ACCESS_EXPIRATION_TIME,
      });
      const refreshToken = jwt.sign({ userId: isExistUser.userId }, process.env.REFRESH_SECRET_KEY, {
         expiresIn: process.env.REFRESH_EXPIRATION_TIME,
      });
      res.cookie('accessToken', accessToken, { httpOnly: true });
      res.cookie('refreshToken', refreshToken, { httpOnly: true });
      const filterUser = {
         userId: isExistUser.userId,
         name: isExistUser.name,
         email: isExistUser.email,
         description: isExistUser.description,
      };
      return filterUser;
   };
   //  로그아웃
   signOut = async res => {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return '성공적으로 로그아웃';
   };
   //   내정보 조회
   findUserById = async (res, userId) => {
      const tokenId = res.locals.user;
      if (tokenId !== userId * 1) {
         throw new Error('잘못된 접근입니다. 관리자에게 문의하세요');
      }
      const userData = await this.usersRepository.findUserById(userId);
      const filterUser = {
         userId: userData.userId,
         name: userData.name,
         email: userData.email,
         description: userData.description,
         createdAt: userData.createdAt,
      };
      return filterUser;
   };

   // 회원 탈퇴
   deleteUser = async (res, password, userId) => {
      if (!password) {
         throw new Error('입력값이 모두 필요합니다.');
      }
      const tokenId = res.locals.user;
      if (tokenId !== 1 * userId) {
         throw new Error('수정 및 삭제할 권한이 없습니다.');
      }
      const findUserById = await this.usersRepository.findUserById(userId);
      if (!findUserById) {
         throw new Error('관리자 문의');
      }
      const isSame = await bcrypt.compare(password, findUserById.password);
      if (!isSame) {
         throw new Error('비밀번호가 틀렸습니다');
      }
      const deleteUser = await this.usersRepository.deleteUser(findUserById.userId);
      if (deleteUser) {
         res.clearCookie('accessToken');
         res.clearCookie('refreshToken');
      }
      const filterUser = {
         userId: deleteUser.userId,
         name: deleteUser.name,
         email: deleteUser.email,
         description: deleteUser.description,
      };
      return filterUser;
   };
}
