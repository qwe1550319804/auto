const path = require("path");
const axios = require("axios");
async function main({e, contentType, uids}) {
  await axios({
    url: "http://wxpusher.zjiecode.com/api/send/message",
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      appToken: "AT_Mv7v1ke0qXn1UE81aHqNrGCH8GMp9Xvk",

      content: `${e}`, //消息摘要，显示在微信聊天页面或者模版消息卡片上，限制长度100，可以不传，不传默认截取content前面的内容。
      contentType: contentType, //内容类型 1表示文字  2表示html(只发送body标签内部的数据即可，不包括body标签) 3表示markdown
      topicIds: [
        //发送目标的topicId，是一个数组！！！，也就是群发，使用uids单发的时候， 可以不传。
      ],
      uids: uids
    }
  });
  console.log("已发送微wxpush");
}
module.exports = main;
