export default function (error, req, res, next) {
  console.log(error);
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

    default:
      statusCode = 500;
      error.message = "관리자에게 문의하세요";
  }
  res.status(statusCode).json({ Code: statusCode, error: error.message });
}
