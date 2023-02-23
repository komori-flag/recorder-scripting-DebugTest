recorderEvents = {
    onDanmaku(json) {
        const d = JSON.parse(json);
    
        if (typeof d.msg === 'string' && d.msg.startsWith('DANMU_MSG:'))
            d.msg = 'DANMU_MSG';
    
        switch (d.cmd) {
            case 'DANMU_MSG':
                const notLevelZero_danmaku = d["info"][4][0] > 1;
                const notRedPackets_danmaku = !d['info'][0][9];
                const notStickers_danmaku = typeof d['info'][0][13] !== 'object';
                // 判断此条弹幕是否不属于红包弹幕和表情弹幕，如果是则
                return notRedPackets_danmaku && notStickers_danmaku && notLevelZero_danmaku;
            case 'SEND_GIFT':
                // 不记录免费礼物
                return d.data.coin_type !== 'silver';
            default:
                return true;
        }
    },
}
