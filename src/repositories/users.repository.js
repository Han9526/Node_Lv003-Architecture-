import { prisma } from "../utils/prisma/index.js";

export class UsersRepository {
  // User 생성 (회원가입)
  createUser = async (name, email, sortPassword, description) => {
    const createdUser = await prisma.Users.create({
      data: { name, email, password: sortPassword, description },
    });
    return createdUser;
  };
  // email로 User 검색 (로그인)
  findUserByEmail = async (email) => {
    const checkedEmail = await prisma.Users.findUnique({
      where: { email: email },
    });
    return checkedEmail;
  };

  //  userId로 User 검색 (내정보 조회)
  findUserById = async (userId) => {
    const userData = await prisma.Users.findUnique({
      where: { userId: +userId },
    });
    return userData;
  };

  // DB 회원탈퇴
  deleteUser = async (userId) => {
    const deletedUser = await prisma.Users.delete({
      where: {
        userId: +userId,
      },
    });
    return deletedUser;
  };
}
