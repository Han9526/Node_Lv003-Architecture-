import express from "express";
import { PostsController } from "../controllers/posts.controller.js";
import authMiddleware from "../middlewares/need-signin.middleware.js";

const router = express.Router();

// PostsController의 인스턴스를 생성합니다.
const postsController = new PostsController();

/** 게시글 조회 API **/
router.get("/posts", postsController.getPosts);

/** 게시글 상세 조회 API **/
router.get("/post/:postId", postsController.getPostById);

/** 게시글 카테고리 조회 API **/
router.get("/category/:category", postsController.getPostByCategory);

/** 게시글 작성 API **/
router.post("/post", authMiddleware, postsController.createPost);

/** 게시글 수정 API **/
router.patch("/post/:postId", authMiddleware, postsController.updatePost);

/** 게시글 삭제 API **/
router.delete("/post/:postId", authMiddleware, postsController.deletePost);

export default router;
