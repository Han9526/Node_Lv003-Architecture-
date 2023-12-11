import { PostsService } from '../services/posts.service.js';

// Post의 컨트롤러(Controller)역할을 하는 클래스
export class PostsController {
   constructor(postsService) {
      this.postsService = postsService;
   }
   //  postsService = new PostsService();
   // 게시판 전체 조회
   getPosts = async (req, res, next) => {
      try {
         const posts = await this.postsService.findAllPosts();

         return res.status(200).json({ message: '성공적으로 조회', data: posts });
      } catch (error) {
         next(error);
      }
   };

   //   게시판 상세 조회
   getPostById = async (req, res, next) => {
      try {
         const { postId } = req.params;
         const post = await this.postsService.findPostById(postId);

         return res.status(200).json({ message: '성공적으로 조회', data: post });
      } catch (error) {
         next(error);
      }
   };

   //   게시판 카테고리별 조회
   getPostByCategory = async (req, res, next) => {
      try {
         const { category } = req.params;

         const post = await this.postsService.findPostByCategory(category);

         return res.status(200).json({ message: '성공적으로 조회', data: post });
      } catch (error) {
         next(error);
      }
   };

   //   게시판 생성
   createPost = async (req, res, next) => {
      try {
         const { title, content, imgUrl, petName, category } = req.body;

         const createdPost = await this.postsService.createPost(res, title, content, imgUrl, petName, category);

         return res.status(201).json({ message: '성공적으로 생성', data: createdPost });
      } catch (error) {
         next(error);
      }
   };
   //   게시판 수정
   updatePost = async (req, res, next) => {
      try {
         const { postId } = req.params;
         const { title, content, petName, category, password } = req.body;
         const updatedPost = await this.postsService.updatePost(
            res,
            password,
            title,
            content,
            petName,
            category,
            postId,
         );

         return res.status(201).json({ message: '성공적으로 수정', data: updatedPost });
      } catch (error) {
         next(error);
      }
   };
   //   게시판 삭제
   deletePost = async (req, res, next) => {
      try {
         const { postId } = req.params;
         const { password } = req.body;

         // 서비스 계층에 구현된 deletePost 로직을 실행합니다.
         const deletedPost = await this.postsService.deletePost(res, password, postId);

         return res.status(201).json({ message: '성공적으로 삭제', data: deletedPost });
      } catch (error) {
         next(error);
      }
   };
}
