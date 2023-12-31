import express from 'express';
import authMiddleware from '../middlewares/need-signin.middleware.js';
import inputVaildateMiddleware from '../middlewares/input-vaildate.middleware.js';

// 의존성 주입으로 인한 import
import { prisma } from '../utils/prisma/index.js';
import { UsersController } from '../controllers/users.controller.js';
import { UsersService } from '../services/users.service.js';
import { UsersRepository } from '../repositories/users.repository.js';
const router = express.Router();

// PostsController의 인스턴스를 생성합니다.
const usersRepository = new UsersRepository(prisma);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);
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
