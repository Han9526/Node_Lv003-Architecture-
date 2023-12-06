import { prisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";

export class UsersRepository {
  // email로 체크하기
  findUserByEmail = async (email) => {
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
  findUser = async (email, password) => {
    const userData = await prisma.Users.findUnique({
      where: { email: email, password: password },
    });
    return userData;
  };

  //   DB 내정보 조회
  findUserById = async (userId) => {
    const userData = await prisma.Users.findUnique({
      where: { userId: +userId },
    });
    return userData;
  };

  // DB 내정보 수정
  updateUser = async (name, email, description, password, userId) => {
    const sortPassword = await bcrypt.hash(password, 11);
    const updatedUser = await prisma.Users.update({
      where: {
        userId: +userId,
      },
      data: {
        name,
        email,
        description,
        password: sortPassword,
      },
    });
    return updatedUser;
  };

  // DB 회원탈퇴
  deleteUser = async (password, userId) => {
    // 1. userId 기준으로 찾은 정보에 password와 비교해서 맞으면 삭제
    const selectedUser = await prisma.Users.findUnique({
      where: {
        userId: +userId,
      },
    });
    const isSame = await bcrypt.compare(password, selectedUser.password);
    if (!isSame) {
      return;
    }
    const deletedUser = await prisma.Users.delete({
      where: {
        userId: +userId,
      },
    });
    return deletedUser;
  };
}
