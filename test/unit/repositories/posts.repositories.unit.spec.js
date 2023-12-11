// __tests__/unit/posts.repository.unit.spec.js

import { jest } from '@jest/globals';
import { PostsRepository } from '../../../src/repositories/posts.repository';

let mockPrisma = {
   Posts: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
   },
   Users: {},
};
let postsRepository = new PostsRepository(mockPrisma);

describe('Posts Repository Unit Test', () => {
   // 각 test가 실행되기 전에 실행됩니다.
   beforeEach(() => {
      jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
   });
   test('findAllPosts Method', async () => {
      // findMany Mock의 Return 값을 "findMany String"으로 설정합니다.
      const mockReturn = 'findMany String';
      mockPrisma.Posts.findMany.mockReturnValue(mockReturn);

      // postsRepository의 findAllPosts Method를 호출합니다.
      const posts = await postsRepository.findAllPosts();

      // prisma.posts의 findMany은 1번만 호출 되었습니다.
      expect(postsRepository.prisma.Posts.findMany).toHaveBeenCalledTimes(1);

      // mockPrisma의 Return과 출력된 findMany Method의 값이 일치하는지 비교합니다.
      expect(posts).toBe(mockReturn);
   });
});
