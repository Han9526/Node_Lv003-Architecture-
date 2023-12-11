// 회원가입 vaildate

export default async function (req, res, next) {
   try {
      const { name, email, password, passwordRe } = req.body;
      if (!name || !email || !password || !passwordRe) {
         throw new Error('입력값이 모두 필요합니다.');
      }
      if (password !== passwordRe) {
         throw new Error('입력한 비밀번호가 서로 다릅니다.');
      }
      if (password.length < 6) {
         throw new Error('비밀번호는 최소 6자리 이상이어야 합니다.');
      }

      let emailValidationRegex = new RegExp('[a-z0-9._]+@[a-z]+.[a-z]{2,3}');
      const isValidEmail = emailValidationRegex.test(email);
      if (!isValidEmail) {
         throw new Error('올바른 이메일 형식이 아닙니다.');
      }
      next();
   } catch (error) {
      next(error);
   }
}
