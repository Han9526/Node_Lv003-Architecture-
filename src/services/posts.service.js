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
      try {
         const posts = await this.postsRepository.findAllPosts();
         if (!posts) {
            throw new Error('등록된 게시판이 없습니다');
         }
         posts.sort((a, b) => {
            return b.createdAt - a.createdAt;
         });

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
      } catch (error) {
         throw error;
      }
   };

   //   게시판 상세 조회
   findPostById = async postId => {
      try {
         const post = await this.postsRepository.findPostById(postId);
         if (!post) {
            throw new Error('등록된 게시판이 없습니다');
         }
         const filerPost = {
            postId: post.postId,
            createdId: post.createdId,
            createdUser: post.createdUser.name,
            title: post.title,
            content: post.content,
            imgUrl: post.imgUrl,
            petName: post.petName,
            category: post.category,
         };
         return filerPost;
      } catch (error) {
         throw error;
      }
   };

   //   게시판 카테고리별 조회
   findPostByCategory = async category => {
      try {
         const categoryPost = await this.postsRepository.findPostByCategory(category);
         if (!categoryPost) {
            throw new Error('등록된 게시판이 없습니다');
         }
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
         if (!title || !content || !petName || !category || !imgUrl) {
            throw new Error('입력값이 모두 필요합니다.');
         }
         const tokenId = res.locals.user;
         const createdPost = await this.postsRepository.createPost(title, content, imgUrl, petName, category, tokenId);

         return {
            postId: createdPost.postId,
            createdUser: createdPost.createdUser.name,
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
            throw new Error('입력값이 모두 필요합니다.');
         }
         const tokenId = res.locals.user;
         const post = await this.postsRepository.findPostById(postId);
         if (!post) {
            throw new Error('등록된 게시판이 없습니다');
         }
         if (post.createdId !== tokenId) {
            throw new Error('수정 및 삭제할 권한이 없습니다.');
         }
         const userData = await this.usersRepository.findUserById(tokenId);
         const isSame = await bcrypt.compare(password, userData.password);
         if (!isSame) {
            throw new Error('비밀번호가 틀렸습니다');
         }
         const updatedPost = await this.postsRepository.updatePost(title, content, petName, category, postId, tokenId);

         return {
            postId: updatedPost.postId,
            createdUser: updatedPost.createdUser.name,
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
            throw new Error('입력값이 모두 필요합니다.');
         }

         const post = await this.postsRepository.findPostById(postId);
         if (!post) {
            throw new Error('등록된 게시판이 없습니다');
         }
         const tokenId = res.locals.user;
         if (post.createdId !== tokenId) {
            throw new Error('수정 및 삭제할 권한이 없습니다.');
         }

         const userData = await this.usersRepository.findUserById(tokenId);
         const isSame = await bcrypt.compare(password, userData.password);
         if (!isSame) {
            throw new Error('비밀번호가 틀렸습니다');
         }
         const deletedPost = await this.postsRepository.deletePost(postId, tokenId);
         return {
            postId: deletedPost.postId,
            createdUser: deletedPost.createdUser.name,
            title: deletedPost.title,
            content: deletedPost.content,
            petName: deletedPost.petName,
         };
      } catch (error) {
         throw error;
      }
   };
}
