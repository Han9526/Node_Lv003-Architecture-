// src/services/posts.service.js

import { UsersRepository } from '../repositories/users.repository.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
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
            throw new Error('값을 모두 입력해라');
         }
         if (password !== passwordRe) {
            throw new Error('입력한 비밀번호가 다름');
         }
         const isExistUser = await this.usersRepository.findUserByEmail(email);
         if (isExistUser) {
            throw new Error('이미 존재하는 email 입니다');
         }
         const sortPassword = await bcrypt.hash(password, 11);
         const createdUser = await this.usersRepository.createUser(name, email, sortPassword, description);

         return createdUser;
      } catch (error) {
         throw error;
      }
   };

   //   로그인
   findUser = async (email, password, res) => {
      try {
         if (!email || !password) {
            throw new Error('값을 모두 입력해라');
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
            expiresIn: '2h',
         });
         const refreshToken = jwt.sign({ userId: isExistUser.userId }, process.env.REFRESH_SECRET_KEY, {
            expiresIn: '2D',
         });
         res.cookie('accessToken', accessToken);
         res.cookie('refreshToken', refreshToken);
         return isExistUser;
      } catch (error) {
         throw error;
      }
   };
   //  로그아웃
   signOut = async res => {
      try {
         res.clearCookie('accessToken');
         res.clearCookie('refreshToken');
         return '성공적으로 로그아웃';
      } catch (error) {
         throw error;
      }
   };
   //   내정보 조회
   findUserById = async userId => {
      try {
         const userData = await this.usersRepository.findUserById(userId);
         if (!userData) {
            throw new Error('뭔가잘못됬어');
         }
         return userData;
      } catch (error) {
         throw error;
      }
   };

   //   내정보 수정
   updateUser = async (res, name, email, description, password, userId) => {
      try {
         // email,password는 확인용이고 email,password 수정X
         // 수정할부분은 나머지
         // 수정페이지에서 default 값으로 db에저장되어있는 값으로 입력되어 있다고 가정
         const tokenId = res.locals.user;
         if (!name || !email || !password) {
            throw new Error('값을 모두 입력해라');
         }
         if (tokenId !== 1 * userId) {
            throw new Error('수정할 권한이 없슴');
         }
         const findUserById = await this.usersRepository.findUserById(1 * userId);
         if (!findUserById) {
            throw new Error('존재하는 않는 email 입니다');
         }
         const isSame = await bcrypt.compare(password, findUserById.password);
         if (!isSame) {
            throw new Error('비밀번호가 틀렸습니다');
         }

         const editUser = await this.usersRepository.updateUser(name, description, tokenId);
         return editUser;
      } catch (error) {
         throw error;
      }
   };

   // 회원 탈퇴
   deleteUser = async (res, password, userId) => {
      try {
         if (!password) {
            throw new Error('값을 모두 입력해라');
         }
         const tokenId = res.locals.user;
         if (tokenId !== 1 * userId) {
            throw new Error('수정할 권한이 없슴');
         }
         const findUserById = await this.usersRepository.findUserById(1 * userId);
         if (!findUserById) {
            throw new Error('존재하는 않는 email 입니다');
         }
         const isSame = await bcrypt.compare(password, findUserById.password);
         if (!isSame) {
            throw new Error('비밀번호가 틀렸습니다');
         }
         const deleteUser = await this.usersRepository.deleteUser(findUserById.userId);
         res.clearCookie('accessToken');
         res.clearCookie('refreshToken');
         return deleteUser;
      } catch (error) {
         throw error;
      }
   };
}
