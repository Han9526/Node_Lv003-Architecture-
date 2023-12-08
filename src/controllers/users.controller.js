// src/controllers/posts.controller.js

import { UsersService } from "../services/users.service.js";

// Post의 컨트롤러(Controller)역할을 하는 클래스
export class UsersController {
  usersService = new UsersService();

  // 회원가입
  signUp = async (req, res, next) => {
    try {
      const { name, email, password, passwordRe, description } = req.body;
      const createdUser = await this.usersService.createUser(
        name,
        email,
        password,
        passwordRe,
        description
      );
      return res
        .status(201)
        .json({ message: "성공적으로 회원가입", createdUser: createdUser });
    } catch (error) {
      next(error);
    }
  };

  // 로그인
  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await this.usersService.findUser(email, password, res);

      return res.status(200).json({ message: "성공적으로 로그인", user: user });
    } catch (error) {
      next(error);
    }
  };

  // 내정보 조회
  getUserById = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const userInfo = await this.usersService.findUserById(userId);
      return res
        .status(200)
        .json({ message: "성공적으로 내정보조회", userInfo: userInfo });
    } catch (error) {
      next(error);
    }
  };

  //  내정보 수정
  updateUser = async (req, res, next) => {
    try {
      const { name, email, description, password } = req.body;
      const { userId } = req.params;

      // 서비스 계층에 구현된 updatePost 로직을 실행합니다.
      const updatedUser = await this.usersService.updateUser(
        res,
        name,
        email,
        description,
        password,
        userId
      );

      return res
        .status(200)
        .json({ message: "성공적으로 수정", updatedUser: updatedUser });
    } catch (error) {
      next(error);
    }
  };

  // 로그아웃
  signOut = async (req, res, next) => {
    try {
      const signOut = await this.usersService.signOut(res);
      return res.status(200).json({ message: signOut });
    } catch (error) {
      next(error);
    }
  };

  // 회원탈퇴
  withDraw = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { password } = req.body;
      const deleteUser = await this.usersService.deleteUser(
        res,
        password,
        userId
      );
      return res
        .status(200)
        .json({ message: "성공적으로 탈퇴", deleteUser: deleteUser });
    } catch (error) {
      next(error);
    }
  };
}
