import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import UsersRouter from "./routers/users.router.js";
import PostsRouter from "./routers/posts.router.js";
import ErrorHandlingMiddleware from "./middlewares/error-handler.middleware.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use("/api", [UsersRouter, PostsRouter]);
app.use(ErrorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
