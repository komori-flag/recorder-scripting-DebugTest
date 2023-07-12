recorderEvents = {
    onDanmakuHandshake(roomInfo, json) {
        let jsonData = JSON.parse(json);
        // console.log(`roomInfo.roomId: ${roomInfo.roomId},
        //             roomInfo.shortId: ${roomInfo.shortId},
        //             roomInfo.name: ${roomInfo.name},
        //             roomInfo.title: ${roomInfo.title},
        //             roomInfo.areaParent: ${roomInfo.areaParent},
        //             roomInfo.areaChild: ${roomInfo.areaChild},
        //             roomInfo.objectId: ${roomInfo.objectId},
        //             jsonData.uid: ${jsonData.uid},
        //             roomInfo.apiData.room_info.uid: ${roomInfo.apiData.room_info.uid}`)
        jsonData.uid = roomInfo.apiData.room_info.uid;
        // console.log(`uid 修改后: ${jsonData.uid}`);
        return JSON.stringify(jsonData);
    }
}