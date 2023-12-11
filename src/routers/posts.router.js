import express from 'express';

import authMiddleware from '../middlewares/need-signin.middleware.js';

// 의존성주입으로 인한
import { prisma } from '../utils/prisma/index.js';
import { PostsController } from '../controllers/posts.controller.js';
import { PostsService } from '../services/posts.service.js';
import { PostsRepository } from '../repositories/posts.repository.js';
import { UsersRepository } from '../repositories/users.repository.js';

// PostsController의 인스턴스를 생성합니다.

const router = express.Router();

// 의존성주입
const postsRepository = new PostsRepository(prisma);
const usersRepository = new UsersRepository(prisma);
const postsService = new PostsService(postsRepository, usersRepository);
// PostsController의 인스턴스를 생성합니다.
const postsController = new PostsController(postsService);

/** 게시글 조회 API **/
router.get('/posts', postsController.getPosts);

/** 게시글 상세 조회 API **/
router.get('/post/:postId', postsController.getPostById);

/** 게시글 카테고리 조회 API **/
router.get('/category/:category', postsController.getPostByCategory);

/** 게시글 작성 API **/
router.post('/post', authMiddleware, postsController.createPost);

/** 게시글 수정 API **/
router.patch('/post/:postId', authMiddleware, postsController.updatePost);

/** 게시글 삭제 API **/
router.delete('/post/:postId', authMiddleware, postsController.deletePost);

export default router;
