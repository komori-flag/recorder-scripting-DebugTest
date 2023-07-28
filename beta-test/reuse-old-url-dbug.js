/* 基本配置 ================================ */

/* 直播流相关配置 ------------------- */
// debug 信息显示开关（默认值：false）
const switch_debug = false; // true：开启，false：关闭
// 画质选择开关（默认值：false）。如果关闭，则锁定为“原画”画质进行录制。
const switch_optionalQn = false; // true：开启，false：关闭
// 旧直播流地址复用开关（默认值：false）。关闭则获取到的直播流地址将直接输出而不做暂存
// 开启此项功能，需要您安装的录播姬版本位于 2.6.0 及以上
const switch_oldUrl = false; // true：开启，false：关闭
// 获取直播流地址的 API（默认值：https://api.live.bilibili.com）
const FETCH_DOMAIN = "https://api.live.bilibili.com"; // "http(s)://域名（或IP）(:端口号)"
// 获取直播流的 API 选择（默认值：false）
/* 
    v1地址：https://api.live.bilibili.com/room/v1/Room/playUrl?cid=${roomid}&qn={qn}&platform=web
    v2地址：https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${roomid}&protocol=0,1&format=0,1,2&codec=0,1&qn=${qn}&platform=web&ptype=8
    *不同的 API 地址获取的直播流地址或许会有不同吧，选择权就交给你们了​(〜￣△￣)〜
*/
// 需要注意的是，如果开启了高级配置当中的“HLS录制开关”，则这条配置选项将无效，如有需要请先将“HLS录制开关”设置为关闭。
const api_v1v2Choice = false; // true: v1地址；false：v2地址
// 用户登录信息 Cookie
// 此项的配置，需要您安装的录播姬版本位于 2.5.0 及以上
// 用途：向您填写的 API 地址请求获取直播流地址
// 警告：请勿向任何您不信任的 API 端点传入任何有效的 Cookie 数据，这可能会给您带来巨大的账号泄漏风险！！！
// 注意：此脚本以及录播姬的开发者不会对您账号所发生的任何事情负责，包括并不限于被标记为机器人账号、大会员被冻结、无法参与各种抽奖和活动等。
// 郑重提醒：如您知晓您的账号会因以上所列出的部分原因导致账号无法正常使用或权益受损等情况，并愿意承担由此所会带来的一系列后果，请继续以下的操作，此脚本以及录播姬的开发者不会对您的账号所发生的任何后果承担责任。
// 填写方法：将整个 Cookie 字符串复制粘贴进里面即可（例：`Cookie Data`）
const userCookie = ``;

/* 弹幕过滤配置 ------------------------ */
// 弹幕内容脚本接管开关（默认值：false），为以下弹幕屏蔽选项的总开关
const switch_danmakuTakeover = false; // true：开启接管，false：关闭接管
// 弹幕等级屏蔽当中用于计算用户等级的运算符号
// 运算符号：==（等于）、<（小于）、<=（小于等于）、>（大于）、>=（大于等于）
const calculateSigns_danmaku = '<';
// 弹幕等级屏蔽，如不填写则认为不开启等级屏蔽
const notLevel_danmaku = 0; // 整数
// 红包弹幕屏蔽开关（默认值：true）
const switch_redPackets_danmaku = true; // true：开启屏蔽，false：关闭屏蔽
// 表情弹幕屏蔽开关（默认值：true）
const switch_stickers_danmaku = true; // true：开启屏蔽，false：关闭屏蔽


/* 高级配置（一般情况下无需进行改动）============= */

/* 直播流相关配置 ------------------- */
// API 请求次数 （默认值：1 [仅请求一次，如果出错了就交还给录播姬进行请求]）
// 此项如需配置大于 1 的数值，需要您安装的录播姬版本位于 2.6.2 及以上
const HTTPAttempts = 1; // 正整数
// 单个旧直播流最大重连次数，调高了可能会导致录播姬不能及时录制
const oldUrl_singleMaximum = 10; // 正整数
// 单个旧直播流最大重连次数计次器开启等待时间。
const oldUrl_singleMaximum_delayTime = 15; // 正整数，单位：秒（s）
// 直播流筛选正则，如果不填写则不会对直播流地址进行筛选（填写多个无用，仅用排在第一位的正则）
const matchGotcha = [/^https?\:\/\/[^\/]*ov-gotcha07\.bilivideo\.com/];
// User-Agent（用户代理）参数设置
const User_Agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36";
// 指定直播流连接的 IP 地址，如果设置了此选项则优先使用设定的 IP 地址连接直播流地址
// IPV4 / IPV6 地址，可填写多个地址，随机选择
const playUrl_SetIp = ["156.59.188.242"]; // 填写方式：["ip1", "ip2"]
// HLS 录制开关。如果关闭，则仅录制 FLV
// *这个开关是为了未来录播姬支持 HLS 流录制所做的准备，如果您所安装的录播姬不支持 HLS 流录制的话请勿开启，此脚本不会检测您所安装的录播姬是否支持 HLS 录制。
// ps:需要注意的是，如果开启了这个开关，则“获取直播流的 API 选择”配置选项将无效，如有需要请先将“HLS录制开关”设置为关闭。
const switch_HLS = false; // true：开启，false：关闭

/* 弹幕握手相关配置 ----------------- */
// 修改录播姬发送给弹幕服务器握手包当中的 uid 为主播 uid
// 开启此项功能，需要您安装的录播姬版本位于 2.7.0 及以上
// 此项功能目前为测试功能，开启此项可能会导致部分直播间的弹幕服务器较长时间连接不上（远程方在没有完成关闭握手的情况下关闭了 WebSocket 连接。）
// 开启此项功能后需重启录播姬
const switch_danmakuHandshake_UIDModify = false; // true：开启，false：关闭

/* 脚本数据暂存配置 -------------------- */
// 暂存变量名设置，需要注意的是变量名在脚本运行时具有唯一性，如果改动将会影响之前所暂存的数据
const TemporarilyStorage = "FF0ZCF";
/* 
    脚本会在能够暂存数据的录播姬当中（2.6.0 版本及以上）暂时保存以下的数据，这些数据会对脚本部分功能的运行起着重要或关键的作用
    通过“sharedStorage.getItem(`scriptingStorage: ${TemporarilyStorage}`)”获取
    {
        // 旧直播流地址利用相关
        "oldUrl": {
            // 用于 HLS 流等待时间的计算
            "streamStartWaitTime_HLS": [
                // roomid：请求的房间 ID，startTime：此房间 HLS 流请求录制的开始时间戳
                {"roomid": 3, "startTime": 1689996239},
                {"roomid": 110, "startTime": 1689996240}
            ],
            // 旧直播流地址保存
            "oldUrlData": [
                {
                    // roomid：请求的房间 ID，oldUrl_FLV：暂存的 FLV 直播流地址，oldUrl_HLS：暂存的 HLS 直播流地址
                    "roomid": 3,
                    "oldUrl_FLV": [
                        // expires：直播流地址有效时间戳，url：直播流地址，repeatNum：重试次数
                        { "expires": ${getUrl.expires}, "url": ${getUrl.url}, "repeatNum": 0 },
                        { "expires": ${getUrl.expires}, "url": ${getUrl.url}, "repeatNum": 0 }
                    ],
                    "old_HLS": [
                        { "expires": ${getUrl.expires}, "url": ${getUrl.url}, "repeatNum": 0 },
                        { "expires": ${getUrl.expires}, "url": ${getUrl.url}, "repeatNum": 0 }
                    ]
                },
                {
                    "roomid": 2015,
                    "oldUrl_FLV": [
                        { "expires": ${getUrl.expires}, "url": ${getUrl.url}, "repeatNum": 0 },
                        { "expires": ${getUrl.expires}, "url": ${getUrl.url}, "repeatNum": 0 }
                    ],
                    "old_HLS": [
                        { "expires": ${getUrl.expires}, "url": ${getUrl.url}, "repeatNum": 0 },
                        { "expires": ${getUrl.expires}, "url": ${getUrl.url}, "repeatNum": 0 }
                    ]
                }
            ]
        }
    }

*/



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
        const [getRoomID, userQnArr, qnArr_def] = [data.roomid, data.qn, [10000]];

        // 1. 向用户所设置的 API 请求数据
        if (switch_debug) console.log("1. 向用户所设置的 API 请求数据");
        let JSON_playUrl = new urlFetch(getRoomID, qnArr_def[0]).JSON_playUrl;
        if (!JSON_playUrl.ok) return null;

        // 2. 直播间画质选择
        if (switch_debug) console.log("2. 直播间画质选择");
        let [optionalQnData, JSON_playUrl_optionalQn, getQnArr, qnArr] = [null, null, [], []];
        if (switch_optionalQn) {
            optionalQnData = new optionalQn(getRoomID, userQnArr, JSON_playUrl);
            // 未匹配到用户设定的画质，给录播姬传入无法录制的地址，使其重复开启录制，直到匹配到用户设定的画质
            if (!optionalQnData.ok) return optionalQnData.repeatPlayUrl;
            // 匹配到用户设定的画质后，赋值参数
            [getQnArr, qnArr, JSON_playUrl_optionalQn] = [optionalQnData.getQnArr, optionalQnData.qnArr, optionalQnData.JSON_repeatPlayUrl];
        } else {
            if (switch_debug) console.log("您没有开启“画质选择”功能，锁定为“原画[10000]”画质");
            optionalQnData = new optionalQn(); optionalQnData = switch_HLS ? optionalQnData.v2_optionalQnCheck(userQnArr, JSON_playUrl) : !api_v1v2Choice ? optionalQnData.v2_optionalQnCheck(userQnArr, JSON_playUrl) : optionalQnData.v1_optionalQnCheck(userQnArr, JSON_playUrl);
            [getQnArr, qnArr] = [optionalQnData.getQnArr, qnArr_def];
        }

        // 3. b站直播 API 数据处理
        if (switch_debug) console.log("3. b站直播 API 数据处理");
        let playUrl = new biliapi_JSONProcess(JSON_playUrl_optionalQn ? JSON_playUrl_optionalQn : JSON_playUrl).playUrl;
        if (!playUrl) return null;

        // debug 录制房间信息显示
        if (switch_debug) console.log(`用户选定的录制画质：[${userQnArr.toString()}]，当前直播间获取到的画质：[${getQnArr.toString()}]，最终选定录制画质：${qnArr[0]}(${qnConvert(qnArr[0])})\n当前获取的房间ID：${getRoomID}，选定录制的画质：${qnArr[0]}(${qnConvert(qnArr[0])})`);

        // 4. 旧直播流地址复用
        if (switch_debug) console.log("4. 旧直播流地址复用");
        if (!switch_oldUrl) { if (switch_debug) console.log("您没有开启“旧直播流地址复用”功能，将直接输出直播流地址而不做暂存操作"); return playUrl }
        // let oldRecUrl = new oldUrl(getRoomID, playUrl).oldUrl;
        let oldRecUrl = oldUrl(getRoomID, playUrl, qnArr[0]);
        return oldRecUrl ? oldRecUrl : playUrl;
    },
    onTransformStreamUrl(originalUrl) {
        if (playUrl_SetIp.length <= 0) return null;
        const setIp = playUrl_SetIp[Math.floor(Math.random() * playUrl_SetIp.length)];
        if (switch_debug) console.log(`您手动指定了连接直播流的 IP 地址为：${setIp}。`);
        return { 'url': originalUrl, 'ip': setIp };
    },
    onDanmakuHandshake(roomInfo, json) {
        if (!switch_danmakuHandshake_UIDModify) return null;
        let jsonData = JSON.parse(json);
        if (switch_debug) console.log(`roomInfo.roomId: ${roomInfo.roomId},
                    roomInfo.shortId: ${roomInfo.shortId},
                    roomInfo.name: ${roomInfo.name},
                    roomInfo.title: ${roomInfo.title},
                    roomInfo.areaParent: ${roomInfo.areaParent},
                    roomInfo.areaChild: ${roomInfo.areaChild},
                    roomInfo.objectId: ${roomInfo.objectId},
                    jsonData.uid: ${jsonData.uid},
                    roomInfo.apiData.room_info.uid: ${roomInfo.apiData.room_info.uid}`);
        if (switch_debug) console.log(`弹幕握手包数据修改前：${json.toString()}`);
        delete jsonData.key; delete jsonData.platform;
        jsonData.uid = roomInfo.apiData.room_info.uid;
        if (switch_debug) console.log(`弹幕握手包数据修改后：${JSON.stringify(jsonData).toString()}`);
        return JSON.stringify(jsonData);
    },
    // onDanmaku(json) {
    //     if (switch_danmakuTakeover) return null;

    //     const d = JSON.parse(json);

    //     if (typeof d.msg === 'string' && d.msg.startsWith('DANMU_MSG:'))
    //         d.msg = 'DANMU_MSG';

    //     switch (d.cmd) {
    //         case 'DANMU_MSG':
    //             const notLevel_danmaku = d["info"][4][0] > 1;
    //             const notRedPackets_danmaku = !d['info'][0][9] && switch_redPackets_danmaku;
    //             const notStickers_danmaku = typeof d['info'][0][13] !== 'object';
    //             return notRedPackets_danmaku && notStickers_danmaku && notLevel_danmaku;
    //         case 'SEND_GIFT':
    //             // 不记录免费礼物
    //             return d.data.coin_type === 'silver';
    //         default:
    //             return true;
    //     }
    // }
}


// qn-->画质
const qnConvert = qn => {
    // 初始化Map对象
    const myMap = new Map([[30000, "杜比"], [20000, "4K"], [10000, "原画"], [401, "蓝光(杜比)"], [400, "蓝光"], [250, "超清"], [150, "高清"], [80, "流畅"]]);
    let item = null;

    if (qn && typeof qn === 'number') {
        item = myMap.get(qn);
        if (!item) return "未知";
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


// B站直播流地址数据请求
const urlFetch = class {
    constructor(roomid, qn) {
        if (switch_debug) console.log(`用户传入的房间号：${roomid}，qn值：${qn}，使用${switch_HLS ? "v2" : !api_v1v2Choice ? "v2" : "v1"}地址请求`);
        let JSON_playUrl = null;
        for (let i = 0; i <= HTTPAttempts; i++) {
            if (i >= HTTPAttempts) throw new Error("HTTP请求次数超过阈值，无法从设定的 API 当中拉取有效的数据，将直播流地址选择交给录播姬")
            try {
                // 开启“HLS录制开关”，强制使用v2来获取直播流地址
                if (switch_HLS) JSON_playUrl = this.v2_recData(roomid, qn);
                // 用户指定为使用 v2 地址来获取直播流地址
                else if (!api_v1v2Choice) JSON_playUrl = this.v2_recData(roomid, qn);
                // 用户指定为使用 v1 地址来获取直播流地址
                else JSON_playUrl = this.v1_recData(roomid, qn);
                break;
            } catch (err) { console.error(`HTTP请求错误（${i}/${HTTPAttempts}），\n错误原因：${err}`); }
        }
        return { "ok": true, "JSON_playUrl": JSON_playUrl, "v1_recDataGet": this.v1_recData, "v2_recDataGet": this.v2_recData }
    }
    v1_recData(roomid, qn) {
        return fetchSync(`${FETCH_DOMAIN}/room/v1/Room/playUrl?cid=${roomid}&qn=${qn}&platform=web`, {
            method: 'GET',
            headers: { 'Origin': 'https://live.bilibili.com', 'Referer': 'https://live.bilibili.com/', 'User-Agent': User_Agent, 'Cookie': userCookie }
        })
    }
    v2_recData(roomid, qn) {
        return fetchSync(`${FETCH_DOMAIN}/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${roomid}&protocol=0,1&format=0,1,2&codec=0,1&qn=${qn}&platform=web&ptype=8&dolby=5&panorama=1`, {
            method: 'GET',
            headers: { 'Origin': 'https://live.bilibili.com', 'Referer': 'https://live.bilibili.com/', 'User-Agent': User_Agent, 'Cookie': userCookie }
        })
    }
}


// 直播选择画质
const optionalQn = class {
    constructor(getRoomID, userQnArr, JSON_playUrl) {
        // 检查是否传入了参数，如未全部传入则视为未开启选择画质功能
        if (typeof getRoomID !== 'number' || !(userQnArr instanceof Array)) return { "JSON_repeatPlayUrl": null, "qnArr": [], "getQnArr": [], "repeatPlayUrl": null, "ok": false, "v1_optionalQnCheck": this.v1_optionalQnCheck, "v2_optionalQnCheck": this.v2_optionalQnCheck }

        const qnArr_def = [10000];
        let qnProcessData = null;

        // 开启“HLS录制开关”
        if (switch_HLS) qnProcessData = this.v2_optionalQnCheck(userQnArr, JSON_playUrl);
        // 用户指定为“使用v2地址来获取直播流地址”
        else if (!api_v1v2Choice) qnProcessData = this.v2_optionalQnCheck(userQnArr, JSON_playUrl);
        // 用户指定为“使用v1地址来获取直播流地址”
        else qnProcessData = this.v1_optionalQnCheck(userQnArr, JSON_playUrl);

        // 画质选择
        // 1. 未匹配到用户设定的画质
        if (qnProcessData.qnArr.length < 1) {
            if (switch_debug) console.log(`检测到没有符合设置要求的画质，将稍后再试。设置画质：[${userQnArr.toString()}]，可用画质：[${qnProcessData.getQnArr.toString()}]`);
            return { "JSON_repeatPlayUrl": null, "qnArr": qnProcessData.qnArr, "getQnArr": qnProcessData.getQnArr, "repeatPlayUrl": "http://0.0.0.0", "ok": false, "v1_optionalQnCheck": this.v1_optionalQnCheck, "v2_optionalQnCheck": this.v2_optionalQnCheck }
        }
        // 2. 匹配到用户设定的画质，默认画质
        if (qnProcessData.qnArr[0] === qnArr_def[0]) return { "JSON_repeatPlayUrl": null, "qnArr": qnProcessData.qnArr, "getQnArr": qnProcessData.getQnArr, "repeatPlayUrl": null, "ok": true, "v1_optionalQnCheck": this.v1_optionalQnCheck, "v2_optionalQnCheck": this.v2_optionalQnCheck }
        // 3. 匹配到用户设定的画质，非默认画质
        if (switch_debug) console.log(`检测到符合用户传入的非原画画质，使用用户设定的画质进行请求数据。\n用户设定的画质：[${userQnArr.toString()}]，当前直播间获取到的画质：[${qnProcessData.getQnArr.toString()}]，选择请求的画质：${qnProcessData.qnArr[0]}（${qnConvert(qnProcessData.qnArr[0])}）`);
        let JSON_repeatPlayUrl = new urlFetch(getRoomID, qnProcessData.qnArr[0]).JSON_playUrl;
        return { "JSON_repeatPlayUrl": JSON_repeatPlayUrl, "qnArr": qnProcessData.qnArr, "getQnArr": qnProcessData.getQnArr, "repeatPlayUrl": null, "ok": true, "v1_optionalQnCheck": this.v1_optionalQnCheck, "v2_optionalQnCheck": this.v2_optionalQnCheck }
    }
    // 提取从 v1 地址请求的画质
    v1_optionalQnCheck(userQnArr, JSON_playUrl) {
        if (JSON.parse(JSON_playUrl.body)?.code !== 0) throw new Error(JSON.parse(JSON_playUrl.body)?.message);
        return optionalQn.qnProcess(userQnArr, JSON.parse(JSON_playUrl.body)?.data.quality_description?.map(x => x.qn));
    }
    // 提取从 v2 地址请求的画质
    v2_optionalQnCheck(userQnArr, JSON_playUrl) {
        // 判断 playurl 内是否有内容，如没有则报错
        if (!JSON.parse(JSON_playUrl.body)?.data?.playurl_info?.playurl) throw new Error("糟糕，从 API 获取的数据中无法获取到直播流相关的内容（ playurl : null ），请检查 API 发送的数据是否正确");

        const streams = JSON.parse(JSON_playUrl.body)?.data.playurl_info.playurl.stream;
        return optionalQn.qnProcess(userQnArr, streams.filter(x => x.protocol_name == "http_stream" ? x.protocol_name == "http_stream" : x.protocol_name == "http_hls")[0].format.filter(x => x.format_name == "fmp4" ? x.format_name == "fmp4" : x.format_name == "flv")[0].codec.filter(x => x.codec_name == "avc")[0].accept_qn);
    }
    // qn 数组处理
    static qnProcess(userQnArr, getQnArr) {
        let qnArr = [];
        if (getQnArr?.length) userQnArr.forEach(a => getQnArr.forEach(b => { if (a === b) { qnArr.push(a); } }));
        return { "qnArr": qnArr, "getQnArr": getQnArr }
    }
}


// B站直播流数据处理
const biliapi_JSONProcess = class {
    constructor(JSON_playUrl) {
        let playUrl = null;
        // 开启“HLS录制优先开关”，强制使用v2来处理直播流JSON数据
        if (switch_HLS) playUrl = this.v2_jsonProcess(JSON_playUrl);
        // 用户指定为“使用v2地址来获取直播流地址”
        else if (!api_v1v2Choice) playUrl = this.v2_jsonProcess(JSON_playUrl);
        // 用户指定为“使用v1地址来获取直播流地址”
        else playUrl = this.v1_jsonProcess(JSON_playUrl);

        if (!playUrl) return { "ok": false, "playUrl": null };
        return { "ok": playUrl.ok, "playUrl": playUrl }
    }
    v1_jsonProcess(JSON_playUrl) {
        const urls = JSON.parse(JSON_playUrl.body)?.data.durl?.map(x => x.url);
        if (!(urls?.length)) return null;

        const filtered = urls.filter(x => matchGotcha.length > 0 ? matchGotcha[0].test(x) : x);
        if (!filtered?.length) return urls[Math.floor(Math.random() * urls.length)];
        return filtered[Math.floor(Math.random() * filtered.length)];
    }
    v2_jsonProcess(JSON_playUrl) {
        const streams = JSON.parse(JSON_playUrl.body)?.data?.playurl_info?.playurl?.stream;
        if (!streams) return null;

        // 当“switch_HLS”处于开启状态时，以下检测将无效化
        // 检测“streams”当中是否存在“http_stream”，如果没有则认为此直播间没有 FLV 流，在未开启 HLS 录制开关的情况下报错
        if (!switch_HLS && !streams.map(x => x.protocol_name).includes("http_stream")) throw new Error("糟糕，此直播间没有 FLV 流，录播姬无法开启录制");

        const result = streams.filter(x => switch_HLS ? x.protocol_name == "http_hls" : x.protocol_name == "http_stream")[0].format.filter(x => switch_HLS ? x.format_name == "fmp4" : x.format_name == "flv")[0].codec.filter(x => x.codec_name == "avc")[0];
        const url_info = matchGotcha.length > 0 ? result.url_info.filter(x => matchGotcha[0].test(x.host))[0] : result.url_info[Math.floor(Math.random() * result.url_info.length)];
        if (!url_info) return null;
        return url_info.host + result.base_url + url_info.extra;
    }
}


// 复用旧的真原画直播流地址
// const oldUrl = class {
//     constructor(roomid, playUrl, qn) {
//         // 1. 检查用户运行的录播姬是否存在“sharedStorage”方法
//         if (typeof sharedStorage !== "undefined") {
//             if (switch_debug) console.error("此录播姬的执行脚本内部不存在 sharedStorage 方法，因此无法进行旧直播流地址复用操作，将使用获取到的直播流地址");
//             return { "ok": false, "oldUrl": null };
//         }

//         // 2. 检查 qn 值是否为 10000，不是则直接输出
//         if (qn !== 10000) {
//             if (switch_debug) console.warn("提示：当前获取的画质是非原画（qn不等于10000），故不对此次直播流地址进行复用操作和保存");
//             return { "ok": false, "oldUrl": null }
//         }

//         const timeStamp = Date.now();
//         let playUrl_Processed = null;

//         // 3. 提取存储在录播姬内的旧直播流地址


//         // 4. 
//         // 一：如果存在旧直播流地址
//         // 1. 对所有旧直播流地址的有效时间进行检查，如果没有过期则使用经过筛选的旧直播流地址
//         // 2. 如果全部过期了则 oldUrl 输出 null
//         // 二：如果不存在旧直播流地址
//         // 1. 对新获取的直播流地址进行检查，如为二压原画，oldUrl 输出 null
//         // 2. 如不为二压原画，则 oldUrl 输出 null

//         // 

//         return { "ok": true, "oldUrl": playUrl_Processed }
//     }
//     // 直播流地址过期时间检测
//     url_expiresTimeCheck(oldUrl, timeStamp) {
//         const expires = Number(new URL(oldUrl).searchParams.get('expires'));

//         if (switch_debug) console.log(`检测到存在旧的直播流地址，当前获取的时间戳：${timeStamp}(${timeStampConvert(timeStamp)})，旧的直播流地址有效时间戳：${expires * 1000 - 10}(${timeStampConvert(expires * 1000 - 10)})`);

//         if ((timeStamp / 1000) + 10 < expires) {
//             if (switch_debug) console.log("检测到当前获取的旧的真原画直播流地址未过期，使用旧直播流地址");

//             playUrl_Processed = oldUrl;
//         } else {
//             if (switch_debug) console.log("检测到当前获取的旧的真原画直播流地址已过期，使用新的直播流地址");

//             playUrl_Processed = playUrl_Untreated;

//             sharedStorage.removeItem('playurl:room:' + roomid);
//         }
//     }
//     getOldUrl() {
//         let getOldUrlData = JSON.parse(sharedStorage.getItem(roomid));

//         console.log(getOldUrlData);
//         if (getOldUrlData.roomid !== roomid) return null;

//         if (getOldUrlData.oldUrl_FLV.length < 1) return null;

//         let oldUrl = null;

//         return oldUrl;
//     }
//     JSON_check() { }
//     JSON_process() { }
//     url_join() { }
//     url_remove() { }
// }

// 复用没有过期的真原画直播流地址
const oldUrl = (roomid, playUrl_Untreated, qn) => {
    const oldUrl = sharedStorage.getItem('playurl:room:' + roomid),
        timeStamp = Date.now(),
        qnArr_def = [10000];
    let playUrl_Processed = null;

    if (switch_debug) if (qn !== 10000) console.warn("提示：当前获取的画质是非原画（qn不等于10000），故不对此次直播流地址进行复用操作和保存");

    if (oldUrl && qn === 10000) {
        // 有旧的真原画直播流地址，检查是否过期
        const expires = Number(new URL(oldUrl).searchParams.get('expires'));

        if (switch_debug) console.log(`检测到存在旧的直播流地址，当前获取的时间戳：${timeStamp}(${timeStampConvert(timeStamp)})，旧的直播流地址有效时间戳：${expires * 1000 - 10}(${timeStampConvert(expires * 1000 - 10)})`);

        if ((timeStamp / 1000) + 10 < expires) {
            if (switch_debug) console.log("检测到当前获取的旧的真原画直播流地址未过期，使用旧直播流地址");

            playUrl_Processed = oldUrl;
        } else {
            if (switch_debug) console.log("检测到当前获取的旧的真原画直播流地址已过期，使用新的直播流地址");

            playUrl_Processed = playUrl_Untreated;

            sharedStorage.removeItem('playurl:room:' + roomid);
        }

    } else {
        if (switch_debug) console.log("未检测到当前录制房间存有旧的真原画直播流地址，将使用新的直播流地址");
    }

    // 检查是否是二压原画和非原画画质，不是的话保存
    if (!(/_bluray/.test(playUrl_Untreated)) && qn === qnArr_def[0]) {
        if (switch_debug) console.log("当前获取的直播流地址为真原画，已保存等待复用");

        if (oldUrl) {
            sharedStorage.removeItem('playurl:room:' + roomid);
        }
        sharedStorage.setItem('playurl:room:' + roomid, playUrl_Untreated);
    } else {
        if (switch_debug) console.warn("提示：当前获取的直播流地址为二压原画（地址中带有“_bluray”字样）或非原画画质（qn不是10000），故不对此次获取的直播流地址进行保存操作");
    }

    return playUrl_Processed;
}