import { prisma } from '../utils/prisma/index.js';

export class UsersRepository {
   // 생성자 로 의존성 주입
   constructor(prisma) {
      this.prisma = prisma;
   }
   // User 생성 (회원가입)
   createUser = async (name, email, sortPassword, description) => {
      const createdUser = await this.prisma.Users.create({
         data: { name, email, password: sortPassword, description },
      });
      return createdUser;
   };
   // email로 User 검색 (로그인)
   findUserByEmail = async email => {
      const checkedEmail = await this.prisma.Users.findUnique({
         where: { email: email },
      });
      return checkedEmail;
   };

   //  userId로 User 검색 (내정보 조회)
   findUserById = async userId => {
      const userData = await this.prisma.Users.findUnique({
         where: { userId: +userId },
      });
      return userData;
   };

   // DB 회원탈퇴
   deleteUser = async userId => {
      const deletedUser = await this.prisma.Users.delete({
         where: {
            userId: +userId,
         },
      });
      return deletedUser;
   };
}
