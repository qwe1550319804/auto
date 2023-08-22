// 配置文件
module.exports = {
  // 请求地址
  baseUrl: 'https://api.juejin.cn',
  // api地址
  api: {
    // 登录
    jjApi:'https://api.juejin.cn/passport/user/login/?app_id=2606&iid=1139544024167342&vendor_id=AF2DCD3C-7639-48E6-BB9D-4C9FC6350FE2&version_name=6.3.7&app_name=%E7%A8%80%E5%9C%9F%E6%8E%98%E9%87%91&channel=App%20Store&device_platform=iphone&device_id=752509128547693&install_id=1139544024167342&vid=AF2DCD3C-7639-48E6-BB9D-4C9FC6350FE2&mix_mode=1&device_type=iPhone15%2C2&language=zh-Hans-CN&idfv=AF2DCD3C-7639-48E6-BB9D-4C9FC6350FE2&ssmix=a&os_version=16.1&version_code=6.3.7&aid=2606&resolution=1179%2A2556',
    // 签到
    checkIn: 'https://api.juejin.cn/growth_api/v1/check_in',
    // 查询签到
    getCheckStatus: 'https://api.juejin.cn/growth_api/v1/get_today_status',
    // 查询签到天数
    getCheckInDays: 'https://api.juejin.cngrowth_api/v1/get_counts',
    // 查询当前矿石
    getCurrentPoint: 'https://api.juejin.cn/growth_api/v1/get_cur_point',
    // 查询抽奖
    getlotteryStatus: 'https://api.juejin.cn/growth_api/v1/lottery_config/get',
    // 抽奖
    draw: 'https://api.juejin.cn/growth_api/v1/lottery/draw',
    // 获取沾喜气列表用户
    getLuckyUserList: 'https://api.juejin.cn/growth_api/v1/lottery_history/global_big',
    // 沾喜气
    dipLucky: 'https://api.juejin.cn/growth_api/v1/lottery_lucky/dip_lucky'
  },
}