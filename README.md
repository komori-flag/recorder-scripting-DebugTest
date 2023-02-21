# recorder-userScripting-DbugTest

录播姬的用户脚本（自用测试）

- [recorder.d.ts](./recorder.d.ts): 类型定义
- [examples/example-1.js](./examples/example-1.js): 一个脚本例子
- [examples/reuse-old-url.js](./examples/reuse-old-url.js)：直播流地址复用（通用）
- [examples/reuse-old-ov05url.js](./examples/reuse-old-ov05url.js)：海外ov05直播流地址复用

测试用
- [beta-test/fetchSyncErrTest.js](./beta-test/fetchSyncErrTest.js)：测试fetchSync的Api是否存在更多问题
- [beta-test/ov-gc07SetIp-debug.js](./beta-test/ov-gc07SetIp-debug.js)：测试直播CDN（d1--ov-gotcha07.bilivideo.com）指定IP录制
- [beta-test/scriptingDebug-test.js](./beta-test/scriptingDebug-test.js)：代码试验田


想要实现和完善的功能有
> debug提示：待完善
> 
> 验证用户配置信息功能：待完善
> 
> 处理用户传入的画质选择并优选录制画质：待完善
> 
> 一键清除旧直播流地址：暂未实现
> 
> API地址请求错误重试：暂未实现
> 
> 简化代码，提升执行效率：暂未实现
> 
> ...
