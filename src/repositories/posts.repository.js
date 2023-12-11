// src/repositories/posts.repository.js

// import { prisma } from '../utils/prisma/index.js';
// import bcrypt from 'bcrypt';

export class PostsRepository {
   //findMany(전체,카테고리),findUnique,create,update,delete
   // 생성자 생성으로 의존성주입
   constructor(prisma) {
      // 생성자에서 전달받은 Prisma 클라이언트의 의존성을 주입합니다.
      this.prisma = prisma;
   }
   // 게시물 전체 조회
   findAllPosts = async () => {
      const posts = await this.prisma.Posts.findMany({
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
      const post = await this.prisma.Posts.findUnique({
         where: { postId: +postId },
         include: {
            createdUser: {
               select: {
                  name: true,
               },
            },
         },
      });

      return post;
   };

   // 게시물 카테고리별 조회
   findPostByCategory = async category => {
      const categoryPost = await this.prisma.Posts.findMany({
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
      const createdPost = await this.prisma.Posts.create({
         data: {
            title,
            content,
            imgUrl,
            petName,
            category,
            createdId: tokenId,
         },
         include: {
            createdUser: {
               select: {
                  name: true,
               },
            },
         },
      });

      return createdPost;
   };

   // 게시물 수정
   updatePost = async (title, content, petName, category, postId, tokenId) => {
      const updatedPost = await this.prisma.Posts.update({
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
         include: {
            createdUser: {
               select: {
                  name: true,
               },
            },
         },
      });
      return updatedPost;
   };

   // 게시물 삭제
   deletePost = async (postId, tokenId) => {
      const deletedPost = await this.prisma.Posts.delete({
         where: {
            postId: +postId,
            createdId: tokenId,
         },
         include: {
            createdUser: {
               select: {
                  name: true,
               },
            },
         },
      });
      return deletedPost;
   };
}
