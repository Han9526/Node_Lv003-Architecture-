import express from 'express';
import { UsersController } from '../controllers/users.controller.js';
import authMiddleware from '../middlewares/need-signin.middleware.js';
import inputVaildateMiddleware from '../middlewares/input-vaildate.middleware.js';

const router = express.Router();

// PostsController의 인스턴스를 생성합니다.
const usersController = new UsersController();
// 회원가입
router.post('/signup', inputVaildateMiddleware, usersController.signUp);

// 로그인
router.post('/signin', usersController.signIn);

// 내정보 조회
router.get('/users/:userId', authMiddleware, usersController.getUserById);

// 로그아웃
router.post('/signout', authMiddleware, usersController.signOut);

// 회원 탈퇴
router.delete('/users/:userId', authMiddleware, usersController.withDraw);

export default router;
