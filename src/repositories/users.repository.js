import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';

export class UsersRepository {
   // email로 체크하기
   findUserByEmail = async email => {
      const checkedEmail = await prisma.Users.findUnique({
         where: { email: email },
      });
      return checkedEmail;
   };
   // DB 회원가입
   createUser = async (name, email, sortPassword, description) => {
      const createdUser = await prisma.Users.create({
         data: { name, email, password: sortPassword, description },
      });
      return createdUser;
   };

   //   DB 로그인
   findUser = async (email, sortPassword) => {
      const userData = await prisma.Users.findUnique({
         where: { email: email, password: password },
      });
      return userData;
   };

   //   DB 내정보 조회
   findUserById = async userId => {
      const userData = await prisma.Users.findUnique({
         where: { userId: +userId },
      });
      return userData;
   };

   // DB 내정보 수정
   updateUser = async (name, description, tokenId) => {
      const updatedUser = await prisma.Users.update({
         where: {
            userId: +tokenId,
         },
         data: {
            name,
            description,
         },
      });
      return updatedUser;
   };

   // DB 회원탈퇴
   deleteUser = async userId => {
      const deletedUser = await prisma.Users.delete({
         where: {
            userId: userId,
         },
      });
      return deletedUser;
   };
}
