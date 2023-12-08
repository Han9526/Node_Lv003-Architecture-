export default function (error, req, res, next) {
   console.log(error.message);
   let statusCode;
   switch (error.message) {
      // sign-up
      case '입력값이 모두 필요합니다.':
         statusCode = 400;
         break;
      case '입력한 비밀번호가 서로 다릅니다.':
         statusCode = 400;
         break;
      case '비밀번호는 최소 6자리 이상이어야 합니다.':
         statusCode = 401;
         break;
      case '올바른 이메일 형식이 아닙니다.':
         statusCode = 401;
         break;

      // sign-up

      // sign-in
      case '비밀번호가 틀렸습니다':
         statusCode = 401;
         break;

      case '존재하는 않는 email 입니다':
         statusCode = 404;
         break;

      case '이미 존재하는 email 입니다':
         statusCode = 409;
         break;
      // sign-in

      // JWT
      case 'jwt expired':
         error.message = '토큰이 만료되었습니다.';
         statusCode = 403;
         break;

      case 'invalid signature':
         error.message = '유효하지 않은 토큰 서명입니다.';
         statusCode = 403;
         break;

      case '토큰이 존재하지 않습니다.':
         statusCode = 404;
         break;
      // JWT

      // 내정보 조회
      case '잘못된 접근입니다. 관리자에게 문의하세요':
         statusCode = 403;
         break;
      // 내정보 조회

      // 회원탈퇴
      case '수정 및 삭제할 권한이 없습니다.':
         statusCode = 403;
         break;
      // 회원탈퇴

      // 게시판 전체,상세,카테고리별 조회
      case '등록된 게시판이 없습니다':
         statusCode = 404;
         break;
      // 게시판 전체,상세,카테고리별 조회

      default:
         statusCode = 500;
         error.message = '관리자에게 문의하세요';
   }

   res.status(statusCode).json({ ErrorCode: statusCode, error: error.message });
}
