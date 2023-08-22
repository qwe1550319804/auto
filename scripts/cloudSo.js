"use strict";
// 易用、简洁且高效的http库
const axios = require("axios");
const os = require("os");
const wxpush = require("./utils/wxpush");
const cheerio = require("cheerio"); // 爬虫

let user = [
   {
    email: "936657780@qq.com",
    passwd: "936657780"
  },
  {
    email: "168434828@qq.com",
    passwd: "168434828"
  }
];
var Cookie;
var msg = "";
var msgs = "";
async function init() {
  for (let i = 0; i < 2; i++) {
    await runLogin(user[i]);
  }

  await wxPusher();
}

async function runLogin(e) {
  await login(e);
  // await sign();
  // await getflow();
}

async function login(e) {
  try {
    console.log("小函数1执行完毕");
    const res = await axios({
      url: "https://cloudso.org/auth/login",
      method: "post",
      data: {
        email: e.email,
        passwd: e.passwd,
        code: null
      }
    });

    if (res.data.ret == 1) {
      let arr = res.headers["set-cookie"];
      Cookie =
        arr[1].split(";")[0] +
        ";" +
        arr[4].split(";")[0] +
        ";" +
        arr[3].split(";")[0] +
        ";" +
        arr[2].split(";")[0] +
        ";" +
        arr[0].split(";")[0] +
        ";" +
        "lang=zh-cn";
      await sign(e);
      console.log("login执行了");
    } else {
      console.log("注册===准备发验证码");
      // 防止死循环
      if (num < 2) {
        // qqerification();
      }
    }
  } catch (error) {
    console.error("An error occurred in login:", error);
  }
}

async function sign(e) {
  try {
    console.log("小函数2执行完毕");
    const res = await axios({
      url: "https://cloudso.org/user/checkin",
      method: "post",
      headers: {
        Cookie: Cookie
      }
    });
    if (res) {
      msg = res.data.msg;
      await getflow(e);
    }

    console.log("签到了");
  } catch (error) {
    console.log(error, 333);
  }
}

async function getflow(e) {
  try {
    const res = await axios.get("https://cloudso.org/user", {
      headers: {
        Cookie: Cookie
      }
    });

    let data = res.data;
    const $ = cheerio.load(data);
    let flow = $(".counter").eq(1).text();
    let dataSize = $(".counter").next().text();
    // dataSize == 1 ? "MB" : dataSize;
    const Size = dataSize == "1" ? "MB" : "GB";
    console.log("小函数3执行完毕");
    msgs = msgs + e.email.slice(0, 4) + "账户" + msg + "剩余流量:" + flow + Size + os.EOL;
    msg = "";
    console.log(msgs);
    return msgs;
  } catch (error) {
    console.error("An error occurred in getflow:", error);
    throw error;
  }
}
async function wxPusher() {
  console.log("------事件埋点追踪-------");
  console.log(msgs);
  console.log("-------------------------");
  await wxpush({
    e: msgs,
    contentType: 1, // 1表示文字  2表示html(只发送body标签内部的数据即可，不包括body标签) 3表示markdown
    uids: ["UID_HuUC4LWfVPfHlP5QlkUEpOvku5Gm",
    "UID_OzYvGIbY4lAHqrpys1kqNkXuOsAc" //大萌
  ]
  });
}
// 调用执行函数
init();
