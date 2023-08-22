const axios = require("axios");
function init() {
  let timestamp = new Date().valueOf();
  let time = new Date(timestamp);
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let date = time.getDate();
  const numberStr = year + "/" + month + date;
  return new Promise((resolve, reject) => {
    const req = {
      url: `https://www.rili.com.cn/rili/json/today/${numberStr}.js?_=${timestamp}`,
      method: "get"
    };
    axios(req).then((res) => {
      let a = res.data;
      let b = a.substr(14);
      let c = b.substr(0, b.length - 2);
      console.log(JSON.parse(c));
    });
  });
}
init();
