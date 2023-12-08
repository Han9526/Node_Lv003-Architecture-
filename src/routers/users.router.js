import express from "express";
import { UsersController } from "../controllers/users.controller.js";
import authMiddleware from "../middlewares/need-signin.middleware.js";
import inputVaildateMiddleware from "../middlewares/input-vaildate.middleware.js";

const router = express.Router();

// PostsController의 인스턴스를 생성합니다.
const usersController = new UsersController();
// 회원가입
router.post("/signup", inputVaildateMiddleware, usersController.signUp);

// 로그인
router.post("/signin", usersController.signIn);

// 내정보 조회
router.get("/auth/:userId", authMiddleware, usersController.getUserById);

// 내정보 수정
router.patch(
  "/auth/:userId",
  inputVaildateMiddleware,
  authMiddleware,
  usersController.updateUser
);
// 로그아웃
// 로그아웃에 로그를 기록하는 것이 아니라면
// 프론트에서 쿠키 삭제하는 것이 효율적이다
// clearcookie 테스트 하기 위해 작성
router.post("/signout", authMiddleware, usersController.signOut);

// 회원 탈퇴
router.delete("/auth/:userId", authMiddleware, usersController.withDraw);

export default router;
