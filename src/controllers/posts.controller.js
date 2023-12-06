import { PostsService } from "../services/posts.service.js";

// Post의 컨트롤러(Controller)역할을 하는 클래스
export class PostsController {
  postsService = new PostsService(); // Post 서비스를 클래스를 컨트롤러 클래스의 멤버 변수로 할당합니다.
  // 게시판 전체 조회
  getPosts = async (req, res, next) => {
    // 서비스 계층에 구현된 findAllPosts 로직을 실행합니다.
    const posts = await this.postsService.findAllPosts();

    return res.status(200).json({ data: posts });
  };

  //   게시판 상세 조회
  getPostById = async (req, res, next) => {
    const { postId } = req.params;

    // 서비스 계층에 구현된 findPostById 로직을 실행합니다.
    const post = await this.postsService.findPostById(postId);

    return res.status(200).json({ data: post });
  };

  //   게시판 카테고리별 조회
  getPostByCategory = async (req, res, next) => {
    const { category } = req.params;

    // 서비스 계층에 구현된 findPostById 로직을 실행합니다.
    const post = await this.postsService.findPostByCategory(category);

    return res.status(200).json({ data: post });
  };

  //   게시판 생성
  createPost = async (req, res, next) => {
    const userId = res.locals.user;
    const { title, content, imgUrl, petName, category } = req.body;

    // 서비스 계층에 구현된 createPost 로직을 실행합니다.
    const createdPost = await this.postsService.createPost(
      title,
      content,
      imgUrl,
      petName,
      category,
      userId
    );

    return res.status(201).json({ data: createdPost });
  };
  //   게시판 수정
  updatePost = async (req, res, next) => {
    const { postId } = req.params;
    const { title, content, petName, category } = req.body;
    const userId = res.locals.user;
    // 서비스 계층에 구현된 updatePost 로직을 실행합니다.
    const updatedPost = await this.postsService.updatePost(
      title,
      content,
      petName,
      category,
      postId,
      userId
    );

    return res.status(201).json({ data: updatedPost });
  };
  //   게시판 삭제
  deletePost = async (req, res, next) => {
    const { postId } = req.params;
    const { password } = req.body;
    const userId = res.locals.user;

    // 서비스 계층에 구현된 deletePost 로직을 실행합니다.
    const deletedPost = await this.postsService.deletePost(
      password,
      postId,
      userId
    );

    return res.status(201).json({ data: deletedPost });
  };
}
