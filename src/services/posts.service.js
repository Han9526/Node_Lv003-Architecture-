// src/services/posts.service.js

import { PostsRepository } from '../repositories/posts.repository.js';
import { UsersRepository } from '../repositories/users.repository.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

export class PostsService {
   postsRepository = new PostsRepository();
   usersRepository = new UsersRepository();
   // 게시판 전체 조회
   findAllPosts = async () => {
      // 저장소(Repository)에게 데이터를 요청합니다.
      const posts = await this.postsRepository.findAllPosts();
      if (!posts) {
         throw new Error('등록된 게시판이 없습니다');
      }
      // 호출한 Post들을 가장 최신 게시글 부터 정렬합니다.
      posts.sort((a, b) => {
         return b.createdAt - a.createdAt;
      });
      // title, content, imgUrl, petName, category
      // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
      return posts.map(post => {
         return {
            postId: post.postId,
            createdId: post.createdId,
            createdUser: post.createdUser.name,
            title: post.title,
            content: post.content,
            imgUrl: post.imgUrl,
            petName: post.petName,
            category: post.category,
         };
      });
   };

   //   게시판 상세 조회
   //   댓글이랑 같이 나오게
   findPostById = async postId => {
      try {
         const post = await this.postsRepository.findPostById(postId);
         if (!post) {
            throw new Error('등록된 게시판이 없습니다');
         }
         return post;
      } catch (error) {
         throw error;
      }
   };

   //   게시판 카테고리별 조회
   findPostByCategory = async category => {
      try {
         const categoryPost = await this.postsRepository.findPostByCategory(category);
         return categoryPost.map(post => {
            return {
               postId: post.postId,
               createdId: post.createdId,
               createdUser: post.createdUser.name,
               title: post.title,
               content: post.content,
               imgUrl: post.imgUrl,
               petName: post.petName,
               category: post.category,
            };
         });
      } catch (error) {
         throw error;
      }
   };

   //   게시판 생성
   createPost = async (res, title, content, imgUrl, petName, category) => {
      try {
         // 저장소(Repository)에게 데이터를 요청합니다.
         // access userId가져와야댐
         const tokenId = res.locals.user;
         const createdPost = await this.postsRepository.createPost(title, content, imgUrl, petName, category, tokenId);

         // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
         return {
            postId: createdPost.postId,
            title: createdPost.title,
            content: createdPost.content,
            imgUrl: createdPost.imgUrl,
            createdAt: createdPost.createdAt,
            updatedAt: createdPost.updatedAt,
         };
      } catch (error) {
         throw error;
      }
   };

   //   게시판 수정
   updatePost = async (res, password, title, content, petName, category, postId) => {
      try {
         if (!title || !content || !petName || !category || !password) {
            throw new Error('값을 모두 입력해라');
         }
         // 1.params에서 가져온 postId로 Posts-DB에 접근
         // 2.token에서 user 의 userId 가져와서 tokenId에 저장
         // 3.Post 유효성 검사
         //    3-1 Post가 존재하는지 check
         //    3-2 존재한다면 찾은 Post의 createdId가 tokenId와 같은지 비교
         // 4. password 검사
         //    4-1 User-DB에 접근 userId와 tokenId가 같은 데이터 추출
         //    4-2 User의 password와 body에서 받은 password 비교
         // 5. 수정
         const tokenId = res.locals.user;
         const post = await this.postsRepository.findPostById(postId);
         if (!post) {
            throw new Error('등록된 게시판이 없습니다');
         }
         if (post.createdId !== tokenId) {
            throw new Error('수정할 권한이 없슴');
         }
         const userData = await this.usersRepository.findUserById(tokenId);
         const isSame = await bcrypt.compare(password, userData.password);
         if (!isSame) {
            throw new Error('비밀번호가 틀렸습니다');
         }
         const updatedPost = await this.postsRepository.updatePost(title, content, petName, category, postId, tokenId);

         return {
            postId: updatedPost.postId,
            title: updatedPost.title,
            content: updatedPost.content,
            petName: updatedPost.petName,
         };
      } catch (error) {
         throw error;
      }
   };

   //   게시판 삭제
   deletePost = async (res, password, postId) => {
      try {
         if (!password) {
            throw new Error('값을 모두 입력해라');
         }
         // 1.params에서 가져온 postId로 Posts-DB에 접근
         // 2.token에서 user 의 userId 가져와서 tokenId에 저장
         // 3.Post 유효성 검사
         //    3-1 Post가 존재하는지 check
         //    3-2 존재한다면 찾은 Post의 createdId가 tokenId와 같은지 비교
         // 4. password 검사
         //    4-1 User-DB에 접근 userId와 tokenId가 같은 데이터 추출
         //    4-2 User의 password와 body에서 받은 password 비교
         // 5. 수정
         const post = await this.postsRepository.findPostById(postId);
         if (!post) {
            throw new Error('등록된 게시판이 없습니다');
         }
         const tokenId = res.locals.user;
         if (post.createdId !== tokenId) {
            throw new Error('수정할 권한이 없슴');
         }
         // user db에 접근
         // password 비교
         const userData = await this.usersRepository.findUserById(tokenId);
         const isSame = await bcrypt.compare(password, userData.password);
         if (!isSame) {
            throw new Error('비밀번호가 틀렸습니다');
         }
         const deletedPost = await this.postsRepository.deletePost(postId, tokenId);
         return { message: '성공적으로 삭제', message: deletedPost };
      } catch (error) {
         throw error;
      }
   };
}
