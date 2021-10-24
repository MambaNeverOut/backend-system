const rp = require("request-promise");
const APPID = "wx8face7542606e0d8";
const APPSECRET = "b4b18ca322f9dccc308964e7ad4b5656";
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`;

const fs = require("fs");
const path = require("path");
const fileName = path.resolve(__dirname, "./access_token.json");
// console.log(fileName);
const updateAccessToken = async () => {
  const resStr = await rp(URL);
  const res = JSON.parse(resStr);
  // console.log(res);
  // 写文件
  if (res.access_token) {
    fs.writeFileSync(
      fileName,
      JSON.stringify({
        access_token: res.access_token,
        createTime: new Date(),
      })
    );
  } else {
    await updateAccessToken();
  }
};

const getAccessToken = async () => {
  try {
    // 读取文件
    const readRes = fs.readFileSync(fileName, "utf8");
    console.log(readRes);
    const readObj = JSON.parse(readRes);
    const createTime = new Date(readObj.createTime).getTime();
    const nowTime = new Date().getTime();
    console.log(nowTime);
    if ((nowTime - createTime) / 1000 / 60 / 60 >= 2) {
      console.log(createTime);
      await updateAccessToken();
      await getAccessToken();
    }
    return readObj.access_token;
  } catch (error) {
    console.log(error);
    await updateAccessToken();
    await getAccessToken();
  }
};

setInterval(async () => {
  await updateAccessToken();
}, (7200 - 300) * 1000);

// updateAccessToken()
// getAccessToken();

module.exports = getAccessToken;
