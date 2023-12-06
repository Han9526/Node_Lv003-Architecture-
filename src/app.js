import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import UsersRouter from "./routers/users.router.js";
import PostsRouter from "./routers/posts.router.js";
import ErrorHandlingMiddleware from "./middlewares/error-handler.middleware.js";
import methodOverride from "method-override";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
dotenv.config();

const app = express();
const PORT = process.env.PORT;
const __dirname = dirname(fileURLToPath(import.meta.url));

// app.use(methodOverride("_method"));
// app.use(express.urlencoded({ extended: true }));
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");
// app.use(express.static(`${__dirname}/public`));

app.use(express.json());
app.use(cookieParser());
app.use("/api", [UsersRouter, PostsRouter]);
app.use(ErrorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
