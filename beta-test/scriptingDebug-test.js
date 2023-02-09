/*
    勇士，你来错地方了，这里不是你该来的地方，这里是代码的试验田("▔□▔)/
    这里的东西在录播姬里无法使用，使用即报错
*/

/* 
    本脚本源码基于 Genteure 的录播姬脚本项目（recorder-scripting-template）所开发，遵循 GNU General Public License v3.0 协议
    原地址：https://github.com/BililiveRecorder/recorder-scripting-template
    by：Komori_晓椮
*/

// 暂时无法实现
// HTTP请求错误尝试次数，默认为“3”，调高了可能会导致录播姬不能及时录制
// const HTTPErrorAttempts = 3;

const UserCookie = '';
// 检测直播间可录画质所用的API（可选），如果值为空（''）则会使用“获取直播流地址的API”的地址
const optionalQnCheck_DOMAIN = 'https://api.live.bilibili.com';

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
const dev_class = class {
    constructor() {
        // 对用户传入的配置进行类型检查
        if (Object.prototype.toString.call(userConfig) !== "[object Object]" && typeof userConfig !== "function") {
            throw new TypeError("传入的用户参数有误[传入的用户配置为非对象类型]");
        }

        // 对用户传入的配置进行键值检查
        // 1.键名键值数量
        if (Object.keys(userConfig).length !== 5) {
            throw new TypeError(`传入的用户参数有误[传入的对象名需要5个，却传入了${Object.keys(userConfig).length}个]`)
        }

        if (Object.values(userConfig).length !== 5) {
            throw new TypeError(`传入的用户参数有误[传入的对象值需要5个，却传入了${Object.values(userConfig).length}个]`)
        }

        // 2.键名
        Object.keys(userConfig).map(x => {
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

        // 3.键值类型
        (() => {
            const userConfValCheckArr = ["boolean", "boolean", "boolean", "string", "string"];
            let i, num;
            i = num = 0;
            Object.values(userConfig).map(x => {
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
                num++;
            })
        })();
        
        // return {
        //     // urlFetch: this.urlFetch,
        //     // oldUrlReuse: this.oldUrlReuse
        // };
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

        // 暂时无法实现
        // for (let i = 0; i < HTTPErrorAttempts; i++) {
        //     try {
        //         return fetchSync(`${FETCH_DOMAIN}/room/v1/Room/playUrl?cid=${roomid}&qn=${qn}&platform=web`, {
        //             method: 'GET',
        //             headers: {
        //                 'Origin': 'https://live.bilibili.com',
        //                 'Referer': 'https://live.bilibili.com/',
        //                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36',
        //                 'Cookie': userCookie ? userCookie : ''
        //             }
        //         })
        //     }
        //     catch (err) {
        //         console.error(`HTTP请求错误，将尝试重新拉起请求（${i}/${HTTPErrorAttempts}），\n错误原因：${err}`);
        //     }

        //     if (i === HTTPErrorAttempts) {
        //         throw new Error("执行HTTP请求错误次数超过阈值，无法从设定的API当中拉取有效的数据，将直播流地址选择交给录播姬");
        //     }

        //     i++;
        // }
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
        const oldUrl = sharedStorage.getItem('playurl:room:' + roomid),
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
            // 暂时无法实现
            // {
            //     'keys': 'HTTPErrorAttempts',
            //     'type': 'number'
            // }
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
            message += `\n
                ==========录播姬暂存数据部分==========\n
                录播姬暂存了${sharedStorage.length}个房间的真原画直播流地址\n
                ${sharedStorage.key(0)}`;
        }

        alert(message);
    },
}