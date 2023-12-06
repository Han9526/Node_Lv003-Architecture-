import express from "express";
import { UsersController } from "../controllers/users.controller.js";
import authMiddleware from "../middlewares/need-signin.middleware.js";
const router = express.Router();

// PostsController의 인스턴스를 생성합니다.
const usersController = new UsersController();
// 회원가입
router.post("/signup", usersController.signUp);

// 로그인
router.post("/signin", usersController.signIn);

// 내정보 조회
router.get("/auth/:userId", authMiddleware, usersController.getUserById);

// 내정보 수정
router.patch("/auth/:userId", authMiddleware, usersController.updateUser);

// 로그아웃
router.post("/signout", authMiddleware, usersController.signOut);

// 회원 탈퇴
router.delete("/auth/:userId", usersController.withDraw);

export default router;
