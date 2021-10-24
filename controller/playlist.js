const Router = require("koa-router");
const rp = require("request-promise");
const router = new Router();
const getAccessToken = require("../utils/getAccessToken.js");
const ENV = "translate-env-mea2w";
const fnName = "music";

router.get("/list", async (ctx, next) => {
  const access_token = await getAccessToken();
  // 查询歌单列表
  const url = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${access_token}&env=${ENV}&name=${fnName}`;
  const query = ctx.request.query
  const options = {
    method: "POST",
    uri: url,
    body: {
      $url: "playlist",
      start: parseInt(query.start),
      count: parseInt(query.count),
    },
    json: true, // Automatically stringifies the body to JSON
  };

  const data = await rp(options)
    .then((res) => {
      console.log(res);
      return JSON.parse(res.resp_data).data;
    })
    .catch((err) => {
      console.log(err);
      // POST failed...
    });
    ctx.body = {
      data,
      code: 20000
    }
});

module.exports = router;
