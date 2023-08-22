const axios = require('axios');
const wxpush = require("./utils/wxpush");
 function crawlAPI(e) {
    if(e){
        clearTimeout()
    }
     axios({
    url: "https://api.juejin.cn/growth_api/v1/get_benefit_page?aid=2608&uuid=7223694784186992139&spider=0",
      method: "post",
      data:{"page_no":2,"page_size":16,"type":1,"got_channel":2}
    })
        .then(res => {
           let data=res.data.data
           data.forEach(item => {
        if (item.benefit_config.id === 8) {
        const todayCap = item.today_cap;
        if(todayCap>0){
           wxpush({
          e: `掘金鼠标垫还有:${todayCap}个`,
          contentType: 1, // 1表示文字  2表示html(只发送body标签内部的数据即可，不包括body标签) 3表示markdown
          uids: ["UID_HuUC4LWfVPfHlP5QlkUEpOvku5Gm"]
                 });
             }
           }else{
            console.log('null')
           }
             });
        })
        .catch(error => {
            console.error('An error occurred:', error);
        });
    // 设置下一次爬取的时间间隔
    // const interval = 1000*60*60; // 一小时的毫秒数
    const interval = 1000*10;
    setTimeout(crawlAPI, interval);
}

// 初始启动
crawlAPI(1);

