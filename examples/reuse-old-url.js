// 复用没有过期的真原画直播流地址
recorderEvents = {
    onFetchStreamUrl({ roomid, qn }) {
        let oldUrl = sharedStorage.getItem('playurl:room:' + roomid);
        if (oldUrl) {
            // 有旧的播放地址，检查是否过期
            const expires = new URL(oldUrl).searchParams.get('expires');
            if ((Date.now() / 1000) + 10 < Number(expires)) {
                return oldUrl;
            } else {
                sharedStorage.removeItem('playurl:room:' + roomid);
            }
        }

        // 获取播放地址
        // 注意这里 qn 写死了 10000，没用传入的参数，所以录播姬设置里的画质设置不会生效
        const playUrl = fetchSync(`https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${roomid}&protocol=0,1&format=0,1,2&codec=0,1&qn=10000&platform=web&ptype=8&dolby=5&panorama=1`, {
            method: 'GET',
            headers: {
                'Origin': 'https://live.bilibili.com',
                'Referer': 'https://live.bilibili.com/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36'
            },
        });



        if (!playUrl.ok) {
            return null;
        }

        /** @type {any[]?} */
        const streams = JSON.parse(playUrl.body)?.data?.playurl_info?.playurl?.stream;
        if (!streams) return null;

        const result = streams.filter(x => x.protocol_name == "http_stream")[0].format.filter(x => x.format_name == "flv")[0].codec.filter(x => x.codec_name == "avc")[0];
        const randomId = Math.floor(Math.random() * result.url_info.length);
        const url_info = result.url_info[randomId];
        const playurl = url_info.host + result.base_url + url_info.extra;

        // 检查是否是二压原画，不是的话保存
        if (!(/_bluray/.test(playurl))) {
            sharedStorage.setItem('playurl:room:' + roomid, playurl);
        }

        return playurl;
    }
}