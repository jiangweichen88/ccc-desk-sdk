# vue-sdk-CCCDeskSDK

## 依赖安装

```shell
yarn
```

### 运行服务

默认 `src/main.js` 入口文件

```shell
yarn serve
```

### 打包库

默认 `src/index.js` 入口文件

```shell
yarn lib
```

### 库使用示例

`yarn lib` 之后得到 `Login.umd.js`，修改 `dist/demo.html` 文件后使用浏览器打开

```html
<meta charset="utf-8" />
<title>CCCDeskSDK demo</title>
<body>
  <div>
    <div id="callBar_cccDesk"></div>
  </div>
</body>
<script src="./cccDeskSDK.umd.js"></script>

<script>
  console.log(CCCDeskSDK)
  window.onload = function () {
    CCCDeskSDK.init({
      // 渲染组件
      domId: 'callBar_cccDesk',
      lang: 'zh', //多语言：中文'zh',英文'en'；默认值'zh'
      options: {
        seatName: '2011@CSZHL', //坐席名称 必填
        seatPassword_MD5: 'e10adc3949ba59abbe56e057f20f883e', // 坐席密码，MD5加密32位小写  必填
        wsUrl: 'wss://dev.arccocc.com/ws',
        phoneType: 3, // 登录方式 0手机, 1硬话机, 2 webcall , 3 webrtc
        // wsUrl: 'ws://192.168.110.69:8084/ws',
        extraOpts: {}
      },
      onReady($wsInstance) {
        // onReady为SDK页面渲染完成回调
        //1、如需实时获取WebSocket的数据,可在getStatus回调中获取
        $wsInstance.getStatus((data) => {
          console.log(data)
          const { body, name: type } = data
          switch (type) {
            // 振铃
            case 'ring':
              if ($wsInstance.getIsOutbound(body) === 1) {
                console.log('外呼振铃')
              } else if ($wsInstance.getIsOutbound(body) === 0) {
                console.log('呼入振铃')
              }
              break
          }
          //data格式:{
          //   agentId: "2011@CSZHL",
          //   aicc: "event",
          //   body: {timestamp: 1679562380878, status: 0, reason: "Success",…},
          //   name: "logon",
          //  }
        })
        //2、如需向WebSocket发送请求，可使用$wsInstance.request方法
        // 例如登出
        // $wsInstance.request('logout')
      }
    })
  }
</script>
```
