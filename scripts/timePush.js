const fetch = require("node-fetch");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const axios = require("axios");
const os = require("os");
// 给dayjs添加时区选项
dayjs.extend(utc);
dayjs.extend(timezone);
const weatherKey = "33369e365fe84eb68876f52a2ae51cca"; // 和风天气key
const location = "101010100"; // 和风天气-北京
const type = "1,3,9"; // 和风天气-生活指数type
const tianXingKey = "eb75297818f2413f24e1f1f76662bccd"; // 天行数据的key
const startDay = "2022-10-29"; // 在一起的日期
init();
async function init() {
  try {
    // 获取天气信息
    const weatherRes = await fetch(
      `https://devapi.qweather.com/v7/weather/3d?key=${weatherKey}&location=${location}`
    );
    const weatherData = await weatherRes.json();

    // 获取天气生活指数
    const lifeRes = await fetch(
      `https://devapi.qweather.com/v7/indices/1d?key=${weatherKey}&location=${location}&type=${type}`
    );
    const lifeData = await lifeRes.json();
    // // 随机一句情话
    // const LoveWords = await fetch("https://api.vvhan.com/api/love?type=json");
    // const word = await LoveWords.json();
    // console.log(word);
    // const LoveWord = word.ishan;
    // 获取one一个文案及图片
    const oneRes = await fetch(`http://api.tianapi.com/txapi/one/index?key=${tianXingKey}`);
    const oneData = await oneRes.json();
    const {word, imgurl} = oneData.newslist[0];

    // 计算日期
    const lovingDays = dayjs(dayjs().tz("Asia/Shanghai")).diff(startDay, "days");
    // 爱情文案
    // const love = await fetch("https://v.api.aa1.cn/api/api-wenan-aiqing/index.php?type=json");
    // const loveWriting = await love.json();
    // 用邮件模版生成字符串

    wxPush(weatherData, lifeData, word, imgurl, lovingDays);
    // 发送邮件;
  } catch (e) {
    fault(e);
  }
}
function wxPush(weatherData, lifeData, word, imgurl, lovingDays) {
  const {daily: weatherDataDaily} = weatherData;
  const {daily} = lifeData;

  return new Promise((resolve, reject) => {
    const req = {
      url: "http://wxpusher.zjiecode.com/api/send/message",
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        appToken: "AT_Mv7v1ke0qXn1UE81aHqNrGCH8GMp9Xvk",
        content:"今天是在一起的第"+lovingDays+"天！"+os.EOL+word+os.EOL + '今日北京气温：'+ weatherDataDaily[0].tempMin +'°C'+'----'+weatherDataDaily[0].tempMax+'°C' +os.EOL+daily[1].name+'：'+daily[1].category+daily[1].text+os.EOL+daily[2].name+'：'+daily[2].category+daily[2].text+os.EOL+daily[0].name+'：'+daily[0].category+daily[0].text+os.EOL,

      //   content: ` <div>
      //   <!-- 天数 情话 -->
      //     <span>今天是在一起的第${lovingDays}天！</span>
      //     <span>${word}</span>
      //     <br />
      //   <!-- 图片 -->
      //   <div>
      //     <img
      //       style="width: 100%; max-width: 768px"
      //       src="${imgurl}"
      //       alt="图片"
      //     />
      //   </div>
  
      //   <!-- 天气 -->
      //   <div>
      //     <p>
      //       <b>今日气温:</b>
      //       <span>${weatherDataDaily[0].tempMin}°C - ${weatherDataDaily[0].tempMax}°C</span>
      //     </p>
      //     <ul>
      //       <li style="margin-bottom: 10px">
      //         ${daily[1].name}(${daily[1].category}):
      //         ${daily[1].text}
      //       </li>
      //       <li style="margin-bottom: 10px">
      //         ${daily[2].name}(${daily[2].category}):
      //         ${daily[2].text}
      //       </li>
      //       <li style="margin-bottom: 10px">
      //         ${daily[0].name}(${daily[0].category}):
      //         ${daily[0].text}
      //       </li>
      //     </ul>
      //   </div>
      // </div>`, //消息摘要，显示在微信聊天页面或者模版消息卡片上，限制长度100，可以不传，不传默认截取content前面的内容。
        contentType: 1, //内容类型 1表示文字  2表示html(只发送body标签内部的数据即可，不包括body标签) 3表示markdown
        topicIds: [
          //发送目标的topicId，是一个数组！！！，也就是群发，使用uids单发的时候， 可以不传。
        ],
        uids: [
          //发送目标的UID，是一个数组。注意uids和topicIds可以同时填写，也可以只填写一个。
          "UID_HuUC4LWfVPfHlP5QlkUEpOvku5Gm",
          //   "UID_xm0ep97a09BuSui2ttLsPPvNvCcw",
          "UID_OzYvGIbY4lAHqrpys1kqNkXuOsAc" //大萌
        ]
        //    "url":"http://wxpusher.zjiecode.com" //原文链接，可选参数
      }
    };

    axios(req).then((res) => {
      console.log(res);
    });
  });
}
function fault(e) {
  return new Promise((resolve, reject) => {
    const req = {
      url: "http://wxpusher.zjiecode.com/api/send/message",
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        appToken: "AT_Mv7v1ke0qXn1UE81aHqNrGCH8GMp9Xvk",

        content: `'报错了'${e}`, //消息摘要，显示在微信聊天页面或者模版消息卡片上，限制长度100，可以不传，不传默认截取content前面的内容。
        contentType: 1, //内容类型 1表示文字  2表示html(只发送body标签内部的数据即可，不包括body标签) 3表示markdown
        topicIds: [
          //发送目标的topicId，是一个数组！！！，也就是群发，使用uids单发的时候， 可以不传。
        ],
        uids: [
          //发送目标的UID，是一个数组。注意uids和topicIds可以同时填写，也可以只填写一个。
          //   "UID_OzYvGIbY4lAHqrpys1kqNkXuOsAc"
          "UID_HuUC4LWfVPfHlP5QlkUEpOvku5Gm"
        ]
        //    "url":"http://wxpusher.zjiecode.com" //原文链接，可选参数
      }
    };

    axios(req).then((res) => {
      console.log(res);
    });
  });
}
