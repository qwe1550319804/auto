"use strict";
const config = require('./utils/config')
const axios = require("axios");
const os = require("os");
const arrAccount=[
    {
        account:'2e3d333436363130343237363531',
        password:'7472603430303536343c3d3531'
    }
]
var msg;
init()
async function init() {
  for (let i = 0; i < arrAccount.length; i++) {
    await jjLogin(i)
   
  }
  // await run()
}
async function jjLogin(i){
  //for循环调接口
     const {headers,data}= await axios({
      url: config.api.jjApi,
      method: "post",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        account: arrAccount[i].account,
        password: arrAccount[i].password,
      },
    });
    arrAccount[i].Cookie = headers["set-cookie"][6];
    arrAccount[i].data = data.data;
    console.log( arrAccount[i].data.screen_name)
    setTimeout(()=>{
    checkIn(i)
    },100)


  return arrAccount;
};
const checkIn = async (i) => {
  console.log( arrAccount[i].Cookie,'checkIn')
  try {
    
    // 查询今天是否签到没
    const checkStatusRes = await getCheckStatus(i)
    if (!checkStatusRes) {
      // 签到
      const checkInRes = await axios({ url: config.api.checkIn, method: 'post',headers:{   Cookie: arrAccount[i].Cookie} })
      
      console.log(`签到成功+${checkInRes.data.incr_point}矿石，总矿石${checkInRes.data.sum_point}`)
    msg = arrAccount[i].data.screen_name+ os.EOL+`签到成功+${checkInRes.data.incr_point}矿石`+os.EOL+`总矿石${checkInRes.data.sum_point}`+os.EOL

      // 查询签到天数
      const getCheckInDaysRes = await getCheckInDays(i)
      msg=msg+os.EOL+`连续签到【${getCheckInDaysRes.continuousDay}】天`+os.EOL+`总签到天数【${getCheckInDaysRes.sumCount}】`+os.EOL+`掘金不停 签到不断💪`
      console.log(`连续签到【${getCheckInDaysRes.continuousDay}】天  总签到天数【${getCheckInDaysRes.sumCount}】  掘金不停 签到不断💪`)

      // 签到成功 去抽奖
      await draw(i)
    } else {
      console.log('今日已经签到 ✅')
    }

  } catch (error) {
    console.error(`签到失败!=======> ${error}`)
  }
}
/**
 * 查看今天是否已经签到
 *
 * @return {Boolean} 是否签到过 
 */
const getCheckStatus = async (i) => {
  console.log(11111111111111)
  console.log( arrAccount[i].Cookie,' arrAccount[i].Cookie')      
  try {
    const getCheckStatusRes = await axios({
      url: config.api.getCheckStatus,
      method: 'get',
      headers:{   Cookie: arrAccount[i].Cookie}
    })
    return getCheckStatusRes.data
  } catch (error) {
    console.log('查询签到失败!')
    // throw `查询签到失败!【${error}】`
  }
}
/**
 *查询签到天数
 *
 * @return {Object} continuousDay 连续签到天数 sumCount 总签到天数
 */
const getCheckInDays = async () => {
  try {
    const getCheckInDays = await axios({ url: config.api.getCheckInDays, method: 'get', headers:{   Cookie: arrAccount[i].Cookie} })
    return { continuousDay: getCheckInDays.data.cont_count, sumCount: getCheckInDays.data.sum_count }
  } catch (error) {
    throw `查询签到天数失败!🙁【${getCheckInDays.err_msg}】`
  }
}
/**
 * 查询当前矿石
 *
 */
const getCurrentPoint = async () => {
  try {
    const getCurrentPointRes = await axios({ url: config.api.getCurrentPoint, method: 'get' , headers:{   Cookie: arrAccount[i].Cookie}})
    console.log(`当前总矿石数: ${getCurrentPointRes.data}`)
  } catch (error) {
    throw `查询矿石失败!${error.err_msg}`
  }

}
/**
 * 查询免费抽奖次数
 *
 * @return {Boolean} 是否有免费抽奖次数
 */
const getlotteryStatus = async () => {
  try {
    const getlotteryStatusRes = await axios({ url: config.api.getlotteryStatus, method: 'get', headers:{   Cookie: arrAccount[i].Cookie} })
    return getlotteryStatusRes.data.free_count === 0
  } catch (error) {
    throw `查询免费抽奖失败！【${error}】`
  }
}
/**
 * 获取沾喜气列表用户historyId
 *
 * @return {string} 被沾的幸运儿的history_id
 */
const getLuckyUserHistoryId = async () => {
  try {
    // 接口为分页查询  默认查询条10条数据 {page_no: 0, page_size: 5}
    const luckyList = await axios({ url: config.api.getLuckyUserList, method: 'post', headers:{   Cookie: arrAccount[i].Cookie} })
    // 随机抽取一位幸运儿  沾他
    return luckyList.data.lotteries[Math.floor(Math.random() * luckyList.data.lotteries.length)]?.history_id
  } catch (error) {
    throw `获取沾喜气列表用户historyId失败`
  }
}
/**
 * 占喜气
 *
 */
const dipLucky = async () => {
  try {
    // 获取historyId
    const historyId = await getLuckyUserHistoryId()
    // 沾喜气接口   传递lottery_history_id
    const dipLuckyRes = await axios({ url: config.api.dipLucky, method: 'post', data: { lottery_history_id: historyId , headers:{   Cookie: arrAccount[i].Cookie}} })
    console.log(`占喜气成功! 🎉 【当前幸运值：${dipLuckyRes.data.total_value}/6000】`)
  } catch (error) {
    throw `占喜气失败！ ${error}`
  }
}
/**
 * 抽奖
 *
 */
const draw = async () => {
  try {
    const freeCount = await getlotteryStatus()
    if (freeCount) {
      // 没有免费抽奖次数
      throw '今日免费抽奖已用完'
    }

    // 开始抽奖
    const drawRes = await axios({ url: config.api.draw, method: 'post' , headers:{   Cookie: arrAccount[i].Cookie}})
    console.log(`恭喜你抽到【${drawRes.data.lottery_name}】🎉`)

    // 沾喜气
    await dipLucky()
    if (drawRes.data.lottery_type === 1) {
      // 抽到矿石 查询总矿石
      await getCurrentPoint()
    }
  } catch (error) {
    console.error(`抽奖失败!=======> 【${error}】`)
  }
}