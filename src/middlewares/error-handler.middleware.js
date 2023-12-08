export default function (error, req, res, next) {
  console.log(error.message);
  let statusCode;
  switch (error.message) {
    case "값을 모두 입력해라":
      statusCode = 400;
      break;

    case "입력한 비밀번호가 다름":
      statusCode = 400;
      break;

    case "비밀번호가 틀렸습니다":
      statusCode = 401;
      break;

    case "존재하는 않는 email 입니다":
      statusCode = 404;
      break;

    case "이미 존재하는 email 입니다":
      statusCode = 409;
      break;

    case "비밀번호가 틀렸습니다":
      statusCode = 401;
      break;

    case "jwt expired":
      error.message = "토큰이 만료";
      statusCode = 403;
      break;

    case "invalid signature":
      error.message = "토큰이 유효X";
      statusCode = 403;
      break;

    case "토큰이 존재하지 않습니다.":
      statusCode = 404;
      break;

    case "수정할 권한이 없슴":
      statusCode = 403;
      break;

    case "등록된 게시판이 없습니다":
      statusCode = 404;
      break;

    case "값을 모두 입력해라 벨리":
      statusCode = 222;
      break;

    default:
      statusCode = 500;
      error.message = "관리자에게 문의하세요";
  }

  res.status(statusCode).json({ ErrorCode: statusCode, error: error.message });
}
