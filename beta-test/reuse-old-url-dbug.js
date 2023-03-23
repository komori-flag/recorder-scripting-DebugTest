/* 用户配置信息 ============================= */

// debug 信息显示开关
const debugInfoShow = false; // true：开启，false：关闭
// 旧直播流地址复用开关。如果关闭，则获取到的直播流地址将直接输出而不做暂存
const oldUrlSwitch = true; // true：开启，false：关闭
// 传入直播间可录画质检测开关。如果关闭，则锁定为“原画”画质进行录制
const optionalQnCheckSwitch = true; // true：开启，false：关闭
// 获取直播流地址的API
const FETCH_DOMAIN = "https://api.live.bilibili.com"; // "http(s)://域名(:端口号)"
// 用户登录信息 Cookie（提示：请勿向不信任的反代端点传入 Cookie！）
const userCookie = "";



/* 源码部分 ============================= */

/* 
    本脚本源码基于 Genteure 的录播姬脚本项目（recorder-scripting-template）所开发，遵循 GNU General Public License v3.0 协议
    原地址：https://github.com/BililiveRecorder/recorder-scripting-template
    by：Komori_晓椮
*/

recorderEvents = {
    onTest(alert) {
        let message = '此条为测试消息​(〜￣△￣)〜';

        // 验证用户配置信息是否存在问题
        let userConfCheckArr = [
            {
                'keys': 'debugInfoShow',
                'type': 'boolean'
            },
            {
                'keys': 'oldUrlSwitch',
                'type': 'boolean'
            },
            {
                'keys': 'optionalQnCheckSwitch',
                'type': 'boolean'
            },
            {
                'keys': 'FETCH_DOMAIN',
                'type': 'string'
            },
            {
                'keys': 'userCookie',
                'type': 'string'
            }
        ];

        message = '正在检测...\n============用户配置部分============\n';
        userConfCheckArr.forEach(x => {
            message += x.keys + '：';
            if (eval(`typeof ${x.keys} === x.type`)) {
                message += 'OK\n';
            } else {
                message += `Error[没有配置 ${x.keys} 变量或者变量类型不是为 ${x.type}]\n`;
            }
        })

        if (typeof sharedStorage !== 'undefined') {
            message += `\n==========录播姬暂存数据部分==========\n录播姬暂存了${sharedStorage.length}个房间的真原画直播流地址`;
        }

        alert(message);
    },
    onFetchStreamUrl(data) {
        const roomid = data.roomid,
            qnArr_def = [10000],
            userQnArr = data.qn;


        // 向用户设置的 API 请求数据
        let playUrl = urlFetch(roomid, qnArr_def[0]);
        if (!playUrl.ok) return null;


        // 直播间可选画质检测
        const optionalQnCheck_cache = optionalQnCheck(userQnArr, playUrl);
        let qnArr = [],
            getQnArr = [];

        qnArr = optionalQnCheck_cache.qnArr_Processed;
        getQnArr = optionalQnCheck_cache.getQnArr;

        if (optionalQnCheckSwitch) {
            if (optionalQnCheck_cache.qnArr_Processed.length < 1) {
                if (debugInfoShow) {
                    console.log(`检测到没有符合设置要求的画质，将稍后再试。设置画质：[${userQnArr.toString()}]，可用画质：[${getQnArr.toString()}]`);
                }
                return 'http://0.0.0.0';
            }

            if (qnArr[0] !== qnArr_def[0]) {
                playUrl = urlFetch(roomid, qnArr[0]);
                if (!playUrl.ok) return null;
            }

        } else {
            qnArr = qnArr_def;
        }


        // JSON 处理
        /** @type {any[]?} */
        const urls = JSON.parse(playUrl.body)?.data.durl?.map(x => x.url);

        if (!(urls?.length)) return null;

        const matchGotcha = /^https?\:\/\/[^\/]*ov-gotcha05\.bilivideo\.com\/.+$/;
        const filtered = urls.filter(x => matchGotcha.test(x));

        let playUrl_Processed = null;
        if (!filtered.length) {
            playUrl_Processed = urls[Math.floor(Math.random() * urls.length)];
        }
        playUrl_Processed = filtered[Math.floor(Math.random() * filtered.length)];


        // 检测当前运行的录播姬的执行脚本内部是否存在 sharedStorage 方法，如果没有就使用获取的直播流地址
        if (!(oldUrlSwitch && typeof sharedStorage !== 'undefined')) {
            if (debugInfoShow && typeof sharedStorage === 'undefined') {
                console.warn("提示：此录播姬的执行脚本内部不存在 sharedStorage 方法，因此无法进行旧直播流地址复用操作，将使用获取到的直播流地址");
            }
            if (debugInfoShow && oldUrlSwitch) {
                console.log("由于“oldUrlSwitch”设置为了“false”，将直接输出直播流地址而不做暂存操作");
            }

            return playUrl_Processed;
        }

        let oldUrl_cache = oldUrl(roomid, playUrl_Processed, userQnArr, getQnArr, qnArr_def, qnArr);
        if (oldUrl_cache) {
            return oldUrl_cache;
        }

        return playUrl_Processed;
    }
}

// qn-->画质
const qnConvert = qn => {
    // 初始化Map对象
    const myMap = new Map([
        [30000, "杜比"],
        [20000, "4K"],
        [10000, "原画"],
        [401, "蓝光(杜比)"],
        [400, "蓝光"],
        [250, "超清"],
        [150, "高清"],
        [80, "流畅"]
    ]);
    let item = null;

    if (qn && typeof qn === 'number') {
        item = myMap.get(qn);

        if (!item) {
            return "未知";
        }

        return item;
    }

    return "未知";
}

// 时间戳转换
const timeStampConvert = (timeStamp) => {
    const date = new Date(timeStamp),
        Y = date.getFullYear() + '-',
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
        D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ',
        h = date.getHours() + ':',
        m = date.getMinutes() + ':',
        s = date.getSeconds();

    return Y + M + D + h + m + s;
}

// 封装好的请求方法
const urlFetch = (roomid, qn) => {
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

// 直播间可选画质检测
const optionalQnCheck = (userQnArr, playUrl_Untreated) => {
    let qnArr = [],
        getQnArr = JSON.parse(playUrl_Untreated.body)?.data.quality_description?.map(x => x.qn);

    if (getQnArr?.length) {
        userQnArr.forEach(a =>
            getQnArr.forEach(b => {
                if (a === b) {
                    qnArr.push(a);
                }
            })
        )
    }

    return {
        qnArr_Processed: qnArr,
        getQnArr: getQnArr
    };
}

// 复用没有过期的真原画直播流地址
const oldUrl = (roomid, playUrl_Untreated, userQnArr, getQnArr, qnArr_def, qnArr) => {
    const oldUrl = sharedStorage.getItem('playurl:room:' + roomid),
        timeStamp = Date.now(),
        qn = userQnArr[0];
    let playUrl_Processed = null;

    if (debugInfoShow) {
        console.log(`用户选定的录制画质：[${userQnArr.toString()}]，当前直播间获取到的画质：[${getQnArr.toString()}]，最终选定录制画质：${qn}`);
        console.log(`当前获取的房间ID：${roomid}，选定录制的画质：${qn}(${qnConvert(qn)})，\n旧的直播流地址：${oldUrl ? oldUrl : "无"}`);

        if (qn !== 10000) {
            console.warn("提示：当前获取的画质是非原画（qn不等于10000），故不对此次直播流地址进行复用操作和保存");
        }
    }

    if (oldUrl && qn === 10000) {
        // 有旧的真原画直播流地址，检查是否过期
        const expires = Number(new URL(oldUrl).searchParams.get('expires'));

        if (debugInfoShow) {
            console.log(`检测到存在旧的直播流地址，当前获取的时间戳：${timeStamp}(${timeStampConvert(timeStamp)})，旧的直播流地址有效时间戳：${expires * 1000 - 10}(${timeStampConvert(expires * 1000 - 10)})`);
        }

        if ((timeStamp / 1000) + 10 < expires) {
            if (debugInfoShow) {
                console.log("检测到当前获取的旧的真原画直播流地址未过期，使用旧直播流地址");
            }

            playUrl_Processed = oldUrl;
        } else {
            if (debugInfoShow) {
                console.log("检测到当前获取的旧的真原画直播流地址已过期，使用新的直播流地址");
            }

            playUrl_Processed = playUrl_Untreated;

            sharedStorage.removeItem('playurl:room:' + roomid);
        }

    } else {
        if (debugInfoShow) {
            console.log("未检测到当前录制房间存有旧的真原画直播流地址，将使用新的直播流地址");
        }
    }

    // 检查是否是二压原画和非原画画质，不是的话保存
    if (!(/_bluray/.test(playUrl_Untreated)) && qn === qnArr_def[0]) {
        if (debugInfoShow) {
            console.log("当前获取的直播流地址为真原画，已保存等待复用");
        }

        if (oldUrl) {
            sharedStorage.removeItem('playurl:room:' + roomid);
        }
        sharedStorage.setItem('playurl:room:' + roomid, playUrl_Untreated);
    } else {
        if (debugInfoShow) {
            console.warn("提示：当前获取的直播流地址为二压原画（地址中带有“_bluray”字样）或非原画画质（qn不是10000），故不对此次获取的直播流地址进行保存操作");
        }
    }

    return playUrl_Processed;
}


const oldUrlMapData = class {
    constructor(data) {
        let url = data.url,
            timeStamp = data.timeStamp;


    }
    pushUrl(data) {
        let getOldUrl = sharedStorage.getItem(`playurl:room:${data.roomid}`)
    }
    removeUrl() {

    }

}