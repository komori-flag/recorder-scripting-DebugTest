/* 用户配置信息 ============================= */

// debug 信息显示开关
const debugInfoShow = false; // true：开启，false：关闭
// 旧直播流地址复用开关
const oldUrlSwitch = false; // true：开启，false：关闭
// 传入直播间可录画质检测，如果关闭，则锁定为“原画”画质进行录制
const optionalQnCheckSwitch = false; // true：开启，false：关闭
// 获取直播流地址的API
const FETCH_DOMAIN = "https://api.live.bilibili.com"; // "http(s)://域名(:端口号)"
// 用户登录信息 Cookie（提示：请勿向不信任的反代端点传入 Cookie！）
const userCookie = '';



/* 源码部分 ============================= */

/* 
    本脚本源码基于 Genteure 的录播姬脚本项目（recorder-scripting-template）所开发，遵循 GNU General Public License v3.0 协议
    原地址：https://github.com/BililiveRecorder/recorder-scripting-template
    by：Komori_晓椮
*/


recorderEvents = {
    onTest(alert) {
        try {
            let getData = Fetch(3, 10000);
            alert(getData);
        } catch (error) {
            alert(error);
        }
    }
}
const Fetch = (roomid, qn) => {
    return fetchSync(`${FETCH_DOMAIN}/room/v1/Room/playUrl?cid=${roomid}&qn=${qn}&platform=web`, {
        method: 'GET',
        headers: {
            'Origin': 'https://live.bilibili.com',
            'Referer': 'https://live.bilibili.com/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36',
            'Cookie': userCookie ? userCookie : ''
        }
    })
}


