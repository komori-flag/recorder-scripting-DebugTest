// @ts-nocheck
/* 用户配置信息 ============================= */

const userConfig = {
    // debug 信息显示开关（boolean）
    // 配置方法：true：开启，false：关闭
    debugInfoShow: false,

    // 旧直播流地址复用开关（boolean）
    // 配置方法：true：开启，false：关闭
    oldUrlSwitch: false,

    // 传入直播间可录画质检测（boolean）
    // 如果设置为关闭（false），则锁定为“原画”画质进行录制
    // 配置方法：optionalQnCheckSwitch: true（开启）/false（关闭）
    optionalQnCheckSwitch: true,

    // 获取直播流地址的API（string）
    // 配置方法："http(s)://域名(:端口号)"，默认为：'https://api.live.bilibili.com'
    FETCH_DOMAIN: 'https://api.live.bilibili.com',

    // 用户登录信息 Cookie（string）
    // 提示：请勿向不信任的反代端点传入 Cookie ！
    // 配置方法：userCookie: '（输入Cookie值）'
    userCookie: ''
}

// debug 信息显示开关
const debugInfoShow = false; // true：开启，false：关闭
// 旧直播流地址复用开关
const oldUrlSwitch = false; // true：开启，false：关闭
// 传入直播间可录画质检测，如果关闭，则锁定为“原画”画质进行录制
const optionalQnCheckSwitch = true; // true：开启，false：关闭
// 获取直播流地址的API
const FETCH_DOMAIN = "https://api.live.bilibili.com"; // "http(s)://域名(:端口号)"
// 用户登录信息 Cookie（提示：请勿向不信任的反代端点传入 Cookie！）
const UserCookie = '';




/* 源码部分 ============================= */

recorderEvents = {
    onTest(alert) {
        if (typeof sharedStorage !== 'undefined') {

        }
    },
    onFetchStreamUrl(data) {
        const roomid = data.roomid;
        let cache = null;
        let qnArr = data.qn.length > 0 ? data.qn : [10000];
        let playUrl = Fetch(roomid, 10000);

        if (!playUrl.ok) return null;

        // 直播间可选画质检测
        if (optionalQnCheckSwitch) {
            cache = optionalQnCheck(qnArr, playUrl);

            /*
                let cache = optionalQnCheck(., ., .);

                if(cache.qn.length < 1) {
                    return 'http://0.0.0.0';
                }

                qn = cache.qn[0];
            */
            if (cache) {
                if (cache.length < 1) {
                    return 'http://0.0.0.0';
                }

                qnArr = cache;

                if (cache.forEach(x => x !== 10000 ? true : false)) {
                    playUrl = Fetch(roomid, cache[0]);
                    if (!playUrl.ok) return null;
                }
            }
        }


        /** @type {any[]?} */
        const urls = JSON.parse(playUrl.body)?.data.durl?.map(x => x.url);

        if (!(urls?.length)) return null;

        const matchGotcha = /^https?\:\/\/[^\/]*ov-gotcha05\.bilivideo\.com\/.+$/;

        const filtered = urls.filter(x => matchGotcha.test(x));

        let playUrl_Processed = null;
        if (filtered.length) {
            playUrl_Processed = filtered[Math.floor(Math.random() * filtered.length)];
        } else {
            playUrl_Processed = urls[Math.floor(Math.random() * urls.length)];
        }

        // 检测当前运行的录播姬的执行脚本内部是否存在 sharedStorage 方法，如果没有就使用获取的直播流地址
        if (oldUrlSwitch) {
            if (typeof sharedStorage !== 'undefined') {
                return oldUrl(roomid, qnArr[0], playUrl_Processed);
            } else {
                if (debugInfoShow) {
                    console.warn("提示：此录播姬的执行脚本内部不存在 sharedStorage 方法，因此无法进行旧直播流地址复用操作，将使用获取到的直播流地址");
                }
            }
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

// 封装好的请求方法
const Fetch = (roomid, qn) => fetchSync(`${FETCH_DOMAIN}/room/v1/Room/playUrl?cid=${roomid}&qn=${qn}&platform=web`, {
    method: 'GET',
    headers: {
        'Origin': 'https://live.bilibili.com',
        'Referer': 'https://live.bilibili.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36',
        'Cookie': UserCookie ? UserCookie : ''
    },
})

// 直播间可选画质检测
const optionalQnCheck = function (qnArr_Untreated, playUrl_Untreated) {
    let qnArr = [],
        getQnArr = JSON.parse(playUrl_Untreated.body)?.data.quality_description?.map(x => x.qn);

    if (!(getQnArr?.length)) {
        qnArr_Untreated.forEach(a => {
            getQnArr.forEach(b => {
                if (a === b) {
                    qnArr.push(a);
                }
            })
        })
    }

    // 输出
    return qnArr;
}

// 复用没有过期的真原画直播流地址
const oldUrl = (roomid, qn, playUrl) => {
    const oldUrl = sharedStorage.getItem('playurl:room:' + roomid),
        timeStamp = Date.now();

    if (debugInfoShow) {
        console.log(`当前获取的房间ID：${roomid}，选定录制的画质：${qn}(${qnConvert(qn)})，旧的直播流地址：${oldUrl ? oldUrl : "无"}`);

        if (qn !== 10000) {
            console.warn("提示：当前获取的画质是非原画（qn不等于10000），故不对此次直播流地址进行复用操作和保存");
        }
    }

    if (oldUrl && qn === 10000) {
        // 有旧的播放地址，检查是否过期
        const expires = Number(new URL(oldUrl).searchParams.get('expires'));

        if (debugInfoShow) {
            console.log(`检测到存在旧的直播流地址，当前获取的时间戳：${timeStamp}(${timeStampConvert(timeStamp)})，旧的直播流地址有效时间戳：${expires * 1000 - 10}(${timeStampConvert(expires * 1000 - 10)})`);
        }

        if ((timeStamp / 1000) + 10 < expires) {
            if (debugInfoShow) {
                console.log("检测到当前获取的旧直播流地址未过期，使用旧直播流地址");
            }

            return oldUrl;
        } else {
            if (debugInfoShow) {
                console.log("检测到当前获取的旧直播流地址已过期，使用新的直播流地址");
            }

            sharedStorage.removeItem('playurl:room:' + roomid);
        }

    } else {
        if (debugInfoShow) {
            console.log("未检测到当前录制房间存有旧的直播流地址，将使用新的直播流地址");
        }
    }

    // 检查是否是二压原画和非原画画质，不是的话保存
    if (!(/_bluray/.test(playUrl)) && qn === 10000) {
        if (debugInfoShow) {
            console.log("当前获取的直播流地址为真原画，已保存等待复用");
        }

        sharedStorage.setItem('playurl:room:' + roomid, playUrl); // {"playurl:room:roomid": "url"}
    } else {
        if (debugInfoShow) {
            console.warn("提示：当前获取的直播流地址为二压原画（地址中带有“_bluray”字样）或非原画画质（qn不是10000），故不对此次获取的直播流地址进行保存操作");
        }
    }

    return playUrl;
}








const dev_class = class {
    constructor() {
        let userConfig_Untreated = userConfig;

        // 对用户传入的配置进行类型检查
        if (Object.prototype.toString.call(userConfig_Untreated) !== "[object Object]" && typeof userConfig_Untreated !== "function") {
            throw new TypeError("传入的用户参数有误[传入的用户配置为非对象类型]");
        }

        // 对用户传入的配置进行键值检查
        // 1.键名键值数量
        if (Object.keys(userConfig_Untreated).length !== 5) {
            throw new TypeError(`传入的用户参数有误[传入的对象名需要5个，却传入了${Object.keys(userConfig_Untreated).length}个]`)
        } 

        if (Object.values(userConfig_Untreated).length !== 5) {
            throw new TypeError(`传入的用户参数有误[传入的对象值需要5个，却传入了${Object.values(userConfig_Untreated).length}个]`)
        }

        // 2.键名
        Object.keys(newObject).map(x => {
            const userConfKeysCheckArr = [
                "debugInfoShow",
                "oldUrlSwitch",
                "optionalQnCheckSwitch",
                "FETCH_DOMAIN",
                "userCookie"
            ];
            if (!(userConfKeysCheckArr.includes(x))) {
                return x;
            }
        }).forEach(x => {
            if (x) {
                throw new TypeError(`传入的用户参数有误[传入的用户配置对象中出现了不该出现的键名：${x}]`);
            }
        });

        // 3.键值
        (() => {
            let i = 0;
            let userConfValCheckArr = ["boolean", "boolean", "boolean", "string", "string"];
            Object.values(newObject).map(x => {
                //console.log(typeof x + "，" + userConfValCheckArr[i]);
                if (userConfValCheckArr[i] !== (typeof x)) {
                    i++;
                    return true;
                } else {
                    i++;
                    return false;
                }
            }).forEach(x => {
                if (x) {
                    throw new TypeError(``);
                }
            })
        })();

        return {
            urlFetch: this.urlFetch,
            oldUrlReuse: this.oldUrlReuse
        };
    }

    // qn-->画质
    qnConvert(qn) {
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
    timeStampConvert(timeStamp) {
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
    urlFetch(data) {
        fetchSync(`${FETCH_DOMAIN}/room/v1/Room/playUrl?cid=${data.roomid}&qn=${data.qn}&platform=web`, {
            method: 'GET',
            headers: {
                'Origin': 'https://live.bilibili.com',
                'Referer': 'https://live.bilibili.com/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36',
                'Cookie': UserCookie ? UserCookie : ''
            },
        })
    }

    // 直播间可选画质检测
    optionalQnCheck(qnArr_Untreated, playUrl_Untreated) {
        let qnArr = [],
            getQnArr = JSON.parse(playUrl_Untreated.body)?.data.quality_description?.map(x => x.qn);

        if (!(getQnArr?.length)) {
            qnArr_Untreated.forEach(a => {
                getQnArr.forEach(b => {
                    if (a === b) {
                        qnArr.push(a);
                    }
                })
            })
        }

        // 输出
        return qnArr;
    }

    // 复用没有过期的真原画直播流地址
    oldUrlReuse(roomid, qn, playUrl) {
        const oldUrl = sharedStorage.getItem('playurl:room:' + data.roomid),
            timeStamp = Date.now();

        if (debugInfoShow) {
            console.log(`当前获取的房间ID：${roomid}，录制的画质：${qn}(${this.qnConvert(qn)})，旧的直播流地址：${oldUrl ? oldUrl : "无"}`);

            if (qn !== 10000) {
                console.warn("提示：当前获取的画质是非原画（qn不等于10000），故不对此次直播流地址进行复用操作和保存");
            }
        }

        if (oldUrl && qn === 10000) {
            // 有旧的播放地址，检查是否过期
            const expires = Number(new URL(oldUrl).searchParams.get('expires'));

            if (debugInfoShow) {
                console.log(`检测到存在旧的直播流地址，当前获取的时间戳：${timeStamp}(${this.timeStampConvert(timeStamp)})，旧的直播流地址有效时间戳：${expires * 1000 - 10}(${this.timeStampConvert(expires * 1000 - 10)})`);
            }

            if ((timeStamp / 1000) + 10 < expires) {
                if (debugInfoShow) {
                    console.log("检测到当前获取的旧直播流地址未过期，使用旧直播流地址");
                }

                return oldUrl;
            } else {
                if (debugInfoShow) {
                    console.log("检测到当前获取的旧直播流地址已过期，使用新的直播流地址");
                }

                sharedStorage.removeItem('playurl:room:' + roomid);
            }

        } else {
            if (debugInfoShow) {
                console.log("未检测到当前录制房间存有旧的直播流地址，将使用新的直播流地址");
            }
        }

        // 检查是否是二压原画和非原画画质，不是的话保存
        if (!(/_bluray/.test(playUrl)) && qn === 10000) {
            if (debugInfoShow) {
                console.log("当前获取的直播流地址为真原画，已保存等待复用");
            }

            sharedStorage.setItem('playurl:room:' + roomid, playUrl); // {"playurl:room:roomid": "url"}
        } else {
            if (debugInfoShow) {
                console.warn("提示：当前获取的直播流地址为二压原画（地址中带有“_bluray”字样）或非原画画质（qn不是10000），故不对此次获取的直播流地址进行保存操作");
            }
        }

        return playUrl;
    }
}
