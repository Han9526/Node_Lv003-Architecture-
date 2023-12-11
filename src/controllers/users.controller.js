import { UsersService } from '../services/users.service.js';

export class UsersController {
   // 생성자로 의존성 주입
   constructor(usersService) {
      this.usersService = usersService;
   }
   // usersService = new UsersService();

   // 회원가입
   signUp = async (req, res, next) => {
      try {
         const { name, email, password, description } = req.body;
         const createdUser = await this.usersService.createUser(name, email, password, description);
         return res.status(201).json({ message: '성공적으로 회원가입', createdUser: createdUser });
      } catch (error) {
         next(error);
      }
   };

   // 로그인
   signIn = async (req, res, next) => {
      try {
         const { email, password } = req.body;
         const user = await this.usersService.findUser(email, password, res);

         return res.status(200).json({ message: '성공적으로 로그인', user: user });
      } catch (error) {
         next(error);
      }
   };

   // 내정보 조회
   getUserById = async (req, res, next) => {
      try {
         const { userId } = req.params;

         const userInfo = await this.usersService.findUserById(res, userId);
         return res.status(200).json({ message: '성공적으로 내정보조회', userInfo: userInfo });
      } catch (error) {
         next(error);
      }
   };

   // 로그아웃
   signOut = async (req, res, next) => {
      try {
         const signOut = await this.usersService.signOut(res);
         return res.status(200).json({ message: signOut });
      } catch (error) {
         next(error);
      }
   };

   // 회원탈퇴
   withDraw = async (req, res, next) => {
      try {
         const { userId } = req.params;
         const { password } = req.body;
         const deleteUser = await this.usersService.deleteUser(res, password, userId);
         return res.status(200).json({ message: '성공적으로 탈퇴', deleteUser: deleteUser });
      } catch (error) {
         next(error);
      }
   };
}
