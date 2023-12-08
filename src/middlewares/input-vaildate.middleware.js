// 회원가입 vaildate

export default async function (req, res, next) {
  try {
    const { name, email, password, passwordRe, description } = req.body;
    if (!name || !email || !password || !passwordRe) {
      throw new Error("값을 모두 입력해라");
    }
    if (password !== passwordRe) {
      throw new Error("입력한 비밀번호가 다름");
    }
    next();
  } catch (error) {
    next(error);
  }
}
