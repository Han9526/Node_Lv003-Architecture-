export default async function (req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new Error("값을 모두 입력해라 벨리");
    }
    next();
  } catch (error) {
    next(error);
  }
}
