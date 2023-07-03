/* 用户配置信息 ============================= */

// 基本配置
/* debug 信息显示开关------------------- */
const switch_debug = false; // true：开启，false：关闭
// 旧直播流地址复用开关。如果关闭，则获取到的直播流地址将直接输出而不做暂存
const switch_oldUrl = false; // true：开启，false：关闭
// 传入直播间可录画质检测开关。如果关闭，则锁定为“原画”画质进行录制
const switch_optionalQnCheck = false; // true：开启，false：关闭
// 获取直播流地址的API
const FETCH_DOMAIN = "https://api.live.bilibili.com"; // "http(s)://域名（或IP）(:端口号)"
// 获取直播流的 API 选择
/* 
    v1地址：https://api.live.bilibili.com/room/v1/Room/playUrl?cid=${roomid}&qn={qn}&platform=web
    v2地址：https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${roomid}&protocol=0,1&format=0,1,2&codec=0,1&qn=${qn}&platform=web&ptype=8
    *不同的 API 地址获取的直播流地址或许会有不同吧，选择权就交给你们了​(〜￣△￣)〜
    ps:需要注意的是，如果开启了高级配置当中的“HLS录制开关”，则这条配置选项将无效，如有需要请先将“HLS录制开关”设置为关闭。
*/
const api_v1v2Choice = false; // true: v1地址；false：v2地址
// 用户登录信息 Cookie
// 警告：请勿向不信任的反代端点传入 Cookie，这可能会给您带来巨大的账号泄漏风险！！！
const userCookie = "";


/* 高级配置（一般情况下无需进行改动）------ */
// API的HTTP请求次数，默认为“1（仅请求一次，如果出错了就报错）”
const HTTPAttempts = 1;
// 单个旧直播流最大重连次数，调高了可能会导致录播姬不能及时录制
const oldUrl_singleMaximum = 5;
// 直播流筛选正则，如果不填写则不会对直播流地址进行筛选（填写多个无用，仅用排在第一位的正则）
const matchGotcha = [/^https?\:\/\/[^\/]*ov-gotcha05\.bilivideo\.com/];
// User-Agent（用户代理）参数设置
const User_Agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36";
// 指定直播流连接的 IP 地址，如果设置了此选项则优先使用设定的 IP 地址连接直播流地址
const playUrl_SetIp = []; // IPV4/IPV6地址，可填写多个地址，随机选择
// HLS录制开关。如果关闭，则仅录制FLV
// *这个开关是为了未来录播姬支持HLS流录制所做的准备，如果您所安装的录播姬不支持HLS录制的话请勿开启。
// ps:需要注意的是，如果开启了这个开关，则“获取直播流的 API 选择”配置选项将无效，如有需要请先将“HLS录制开关”设置为关闭。
const switch_HLS = false; // true：开启，false：关闭




/* 源码部分 ================================ */

/* 
    本脚本源码基于 Genteure 的录播姬脚本项目（recorder-scripting-template）所开发，遵循 GNU General Public License v3.0 协议
    原地址：https://github.com/BililiveRecorder/recorder-scripting-template
    by：Komori_晓椮
*/

recorderEvents = {
    onTest(alert) {

    },
    onFetchStreamUrl(data) {
        // 常量初始化
        const getRoomID = data.roomid,  // 录播姬执行对象时传入的房间号；
            userQnArr = data.qn,  // 录播姬执行对象时传入的用户设定画质值；
            qnArr_def = [10000];  // 默认画质值，默认为[10000]（原画）。

        // 变量初始化
        let liveOptionalQn = null,
            playUrl_Processed = null;

        // 1. 向用户所设置的 API 请求数据
        let playUrlData = new urlFetch(getRoomID, qnArr_def[0]);

        // 2. 直播间可选画质检测
        if (switch_optionalQnCheck) liveOptionalQn = optionalQn(userQnArr, playUrlData);

        // 3. 数据处理
        playUrl = new JSONProcess({});

        // debug 录制房间信息显示
        if (switch_debug) console.log(`用户选定的录制画质：[${data.userQnArr.toString()}]，当前直播间获取到的画质：[${data.getQnArr.toString()}]，最终选定录制画质：${qn}\n当前获取的房间ID：${getRoomID}，选定录制的画质：${data.qn}(${qnConvert(data.qn)})`);

        // 4. 旧直播流
        // debug 旧直播流开关提示
        if (switch_debug) console.log("“switch_oldUrl”设置为了“false”，将直接输出直播流地址而不做暂存操作")
        playUrl_Processed = switch_oldUrl ? new oldUrl() : playUrl_Processed;

        return playUrl_Processed;
    },
    onTransformStreamUrl(originalUrl) {
        if (typeof playUrl_SetIp && playUrl_SetIp.length > 0) {
            return {
                'url': originalUrl,
                'ip': playUrl_SetIp[Math.floor(Math.random() * playUrl_SetIp.length)]
            }
        }
        return originalUrl;
    }
}


// qn-->画质
const qnConvert = qn => {
    // 初始化Map对象
    const myMap = new Map([[30000, "杜比"], [20000, "4K"], [10000, "原画"], [401, "蓝光(杜比)"], [400, "蓝光"], [250, "超清"], [150, "高清"], [80, "流畅"]]);
    let item = null;

    if (qn && typeof qn === 'number') {
        item = myMap.get(qn);
        if (!item) return "未知"
        return item;
    }

    return "未知";
}


// 时间戳转换
const timeStampConvert = timeStamp => {
    const date = new Date(timeStamp),
        Y = date.getFullYear() + '-',
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
        D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ',
        h = date.getHours() + ':',
        m = date.getMinutes() + ':',
        s = date.getSeconds();

    return Y + M + D + h + m + s;
}


// 直播间可选画质检测
const optionalQn = (userQnArr, playUrl_Untreated) => {
    let qnArr = [],
        getQnArr = JSON.parse(playUrl_Untreated.body)?.data.quality_description?.map(x => x.qn);

    if (getQnArr?.length) {
        userQnArr.forEach(a => getQnArr.forEach(b => {
            if (a === b) {
                qnArr.push(a);
            }
        }))
    }

    return {
        qnArr_Processed: qnArr,
        getQnArr: getQnArr
    };
}


// 用户配置检查
const userConfCheck = () => {

    // 验证用户配置信息是否存在问题
    let userConfCheckArr = [
        {
            'keys': 'switch_debug',
            'type': 'boolean'
        },
        {
            'keys': 'switch_oldUrl',
            'type': 'boolean'
        },
        {
            'keys': 'switch_optionalQnCheck',
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

    userConfCheckArr.forEach(x => {


        if (eval(`typeof ${x.keys} === x.type`)) {

        } else if (eval(`typeof ${x.keys} === 'undefined'`)) {

        } else {

        }

    })

}


// 复用没有过期的真原画直播流地址
const oldUrl = class {
    constructor(data) {
        // 检查用户运行的录播姬是否存在“sharedStorage”方法
        if (typeof sharedStorage !== "undefined") {
            if ( switch_debug ) console.error("此录播姬的执行脚本内部不存在 sharedStorage 方法，因此无法进行旧直播流地址复用操作，将使用获取到的直播流地址");
            return data;
        }

        // 初始化常量变量
        const oldUrl = sharedStorage.getItem('playurl:room:' + roomid),
            timeStamp = Date.now(),
            qn = data.qnArr[0];
        let playUrl_Processed = null;

        // 1.录制信息显示，debug时会被调用
        switch_debug ? this.recInfo(qn) : null;

        // 2.直播流地址过期时间检测
        oldUrl ? this.expiresTimeCheck_oldUrl(oldUrl, timeStamp) : null;
    }

    // 录制信息
    recInfo(qn) {
        if (qn !== 10000) console.warn("提示：当前获取的画质是非原画（qn不等于10000），故不对此次直播流地址进行复用操作和保存");
    }

    // 直播流地址过期时间检测
    expiresTimeCheck_oldUrl(oldUrl, timeStamp) {
        const expires = Number(new URL(oldUrl).searchParams.get('expires'));

        if (switch_debug) {
            console.log(`检测到存在旧的直播流地址，当前获取的时间戳：${timeStamp}(${timeStampConvert(timeStamp)})，旧的直播流地址有效时间戳：${expires * 1000 - 10}(${timeStampConvert(expires * 1000 - 10)})`);
        }

        if ((timeStamp / 1000) + 10 < expires) {
            if (switch_debug) {
                console.log("检测到当前获取的旧的真原画直播流地址未过期，使用旧直播流地址");
            }

            playUrl_Processed = oldUrl;
        } else {
            if (switch_debug) {
                console.log("检测到当前获取的旧的真原画直播流地址已过期，使用新的直播流地址");
            }

            playUrl_Processed = playUrl_Untreated;

            sharedStorage.removeItem('playurl:room:' + roomid);
        }
    }

    // 旧直播流地址json处理
    oldUrlJSON() {

    }
}


// B站直播流地址数据请求
const urlFetch = class {
    constructor(data) {
        // 一：检查用户配置的参数
        /*
            1. 如果用户指定为“使用v1地址来获取直播流地址”，则使用“v1_biliDataGet”来获取json数据，输出获取到的数据；
            2. 如果用户指定为“使用v2地址来获取直播流地址”，则使用“v2_biliDataGet”来获取json数据，输出获取到的数据。 
        */
        // 二：请求数据
        // 三：输出数据
        for (let i = 0; i <= HTTPAttempts;) {
            i++;
            try {
                // 开启“HLS录制开关”，强制使用v2来处理直播流JSON数据
                if (switch_HLS) {
                    this.v2_recData(data);
                }
                // 用户指定为“使用v2地址来获取直播流地址”
                else if (!api_v1v2Choice) {
                    this.v2_recData(data);
                }
                // 用户指定为“使用v1地址来获取直播流地址”
                else {
                    this.v1_recData(data);
                }
            }
            catch (err) {
                console.error(`HTTP请求错误（${i}/${HTTPAttempts}），\n错误原因：${err}`);
                if (i <= HTTPAttempts) throw new Error("执行HTTP请求错误次数超过阈值，无法从设定的API当中拉取有效的数据，将直播流地址选择交给录播姬");
            }
        }
    }
    v1_recData = data => fetchSync(`${FETCH_DOMAIN}/room/v1/Room/playUrl?cid=${data.roomid}&qn=${data.qn}&platform=web`, {
        method: 'GET',
        headers: {
            'Origin': 'https://live.bilibili.com',
            'Referer': 'https://live.bilibili.com/',
            'User-Agent': User_Agent,
            'Cookie': userCookie
        }
    })

    v2_recData = data => fetchSync(`${FETCH_DOMAIN}/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${data.roomid}&protocol=0,1&format=0,1,2&codec=0,1&qn=${data.qn}&platform=web&ptype=8&dolby=5&panorama=1`, {
        method: 'GET',
        headers: {
            'Origin': 'https://live.bilibili.com',
            'Referer': 'https://live.bilibili.com/',
            'User-Agent': User_Agent,
            'Cookie': userCookie
        }
    })
}

// B站直播流数据处理
const JSONProcess = class {
    constructor(data) {
        // 一：检查用户配置的参数
        /*
            1. 如果用户指定为“使用v1地址来获取直播流地址”，则使用“v1_jsonProcess”来处理json数据，输出处理后的数据；
            2. 如果用户指定为“使用v2地址来获取直播流地址”，则使用“v2_jsonProcess”来处理json数据，输出处理后的数据。 
        */
        // 二：处理直播流数据 
        // 三：输出处理后的结果

        // 开启“HLS录制优先开关”，强制使用v2来处理直播流JSON数据
        if (switch_HLS) {
            try {
                this.v2_jsonProcess(data);
            } catch (error) {

            }
        }
        // 用户指定为“使用v2地址来获取直播流地址”
        else if (!api_v1v2Choice) {
            try {
                this.v2_jsonProcess(data);
            } catch (error) {

            }
        }
        // 用户指定为“使用v1地址来获取直播流地址”
        else {
            try {
                this.v1_jsonProcess(data);
            } catch (error) {

            }
        }

    }
    v1_jsonProcess(data) {
        if (!data.ok) return null;
        const urls = JSON.parse(data.body)?.data.durl?.map(x => x.url);
        if (!(urls?.length)) return null;

        // 判断用户是否设置了正则进行筛选，如未设置正则则直接输出
        const filtered = urls.filter(x => matchGotcha.length > 0 ? matchGotcha.test(x) : x);

        let playUrl_Processed = null;
        if (!filtered.length) {
            playUrl_Processed = urls[Math.floor(Math.random() * urls.length)];
        }
        playUrl_Processed = filtered[Math.floor(Math.random() * filtered.length)];

        return playUrl_Processed;
    }
    v2_jsonProcess(data) {
        const streams = JSON.parse(data.body)?.data?.playurl_info?.playurl?.stream;
        if (!streams) throw new TypeError("");

        const result = streams.filter(x => switch_HLS ? x.protocol_name == "http_hls" : x.protocol_name == "http_stream")[0].format.filter(x => switch_HLS ? x.format_name == "fmp4" : x.format_name == "flv")[0].codec.filter(x => x.codec_name == "avc")[0];
        const url_info = matchGotcha.length > 0 ? result.url_info.filter(x => matchGotcha.length > 0 ? matchGotcha[0].test(x.host) : x)[0] : result.url_info[Math.floor(Math.random() * result.url_info.length)];
        return url_info.host + result.base_url + url_info.extra;
    }
}

