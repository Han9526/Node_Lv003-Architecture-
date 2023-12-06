// src/services/posts.service.js

import { PostsRepository } from "../repositories/posts.repository.js";
import dotenv from "dotenv";
dotenv.config();

export class PostsService {
  postsRepository = new PostsRepository();
  // 게시판 전체 조회
  findAllPosts = async () => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const posts = await this.postsRepository.findAllPosts();

    // 호출한 Post들을 가장 최신 게시글 부터 정렬합니다.
    posts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    // title, content, imgUrl, petName, category
    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    return posts.map((post) => {
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
  findPostById = async (postId) => {
    const post = await this.postsRepository.findPostById(postId);
    return post;
  };

  //   게시판 카테고리별 조회
  findPostByCategory = async (category) => {
    const categoryPost =
      await this.postsRepository.findPostByCategory(category);
    console.log(
      "🚀 ~ file: posts.service.js:44 ~ PostsService ~ categoryPost:",
      categoryPost
    );
    return categoryPost.map((post) => {
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

  //   게시판 생성
  createPost = async (title, content, imgUrl, petName, category, userId) => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    // access userId가져와야댐
    const createdPost = await this.postsRepository.createPost(
      title,
      content,
      imgUrl,
      petName,
      category,
      userId
    );

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    return {
      postId: createdPost.postId,
      title: createdPost.title,
      content: createdPost.content,
      imgUrl: createdPost.imgUrl,
      createdAt: createdPost.createdAt,
      updatedAt: createdPost.updatedAt,
    };
  };

  //   게시판 수정
  updatePost = async (title, content, petName, category, postId, userId) => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const updatedPost = await this.postsRepository.updatePost(
      title,
      content,
      petName,
      category,
      postId,
      userId
    );

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    return {
      postId: updatedPost.postId,
      title: updatedPost.title,
      content: updatedPost.content,
      petName: updatedPost.petName,
    };
  };

  //   게시판 삭제
  deletePost = async (password, postId, userId) => {
    // 저장소(Repository)에게 데이터를 요청합니다.
    const deletedPost = await this.postsRepository.deletePost(
      password,
      postId,
      userId
    );
    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    return { message: deletedPost };
  };
}
