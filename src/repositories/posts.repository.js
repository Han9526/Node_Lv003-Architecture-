// src/repositories/posts.repository.js

import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';

export class PostsRepository {
   // 게시물 전체 조회
   findAllPosts = async () => {
      const posts = await prisma.Posts.findMany({
         include: {
            createdUser: {
               select: {
                  name: true,
               },
            },
         },
      });
      return posts;
   };

   // 게시물 찾기 posId
   findPostById = async postId => {
      const post = await prisma.Posts.findUnique({
         where: { postId: +postId },
      });

      return post;
   };

   // 게시물 카테고리별 조회
   findPostByCategory = async category => {
      const categoryPost = await prisma.Posts.findMany({
         where: { category: category },
         include: {
            createdUser: {
               select: {
                  name: true,
               },
            },
         },
      });
      return categoryPost;
   };

   // 게시물 생성
   createPost = async (title, content, imgUrl, petName, category, tokenId) => {
      const createdPost = await prisma.Posts.create({
         data: {
            title,
            content,
            imgUrl,
            petName,
            category,
            createdId: tokenId,
         },
      });

      return createdPost;
   };

   // 게시물 수정
   updatePost = async (title, content, petName, category, postId, tokenId) => {
      const updatedPost = await prisma.Posts.update({
         where: {
            postId: +postId,
            createdId: tokenId,
         },
         data: {
            title,
            content,
            petName,
            category,
         },
      });
      return updatedPost;
   };

   // 게시물 삭제
   deletePost = async (postId, tokenId) => {
      const deletedPost = await prisma.Posts.delete({
         where: {
            postId: +postId,
            createdId: tokenId,
         },
      });
      return deletedPost;
   };
}
