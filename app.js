const koa = require("koa");
const app = new koa();
const Router = require("koa-router");
const router = new Router();
const cors = require("koa2-cors");
const request = require("request");
const koaBody = require("koa-body");

const ENV = "translate-env-mea2w";
// 跨域
app.use(
  cors({
    origin: ["http://localhost:9528"],
    credentials: true,
  })
);
app.use(
  koaBody({
    multipart: true,
  })
);

app.use(async (ctx, next) => {
  console.log("全局中间件");
  // ctx.body = "hello world";
  ctx.state.env = ENV;
  await next();
});

const playlist = require("./controller/playlist.js");
router.use("/playlist", playlist.routes());

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
  console.log("服务开启到3000端口");
});
