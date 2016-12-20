# react-upload

图片上传组件

![alt text](blob:http://datianyun.github.io/9ea61cb0-3779-4792-a14c-c80e37c14c9c "title")
[在线demo](http://datianyun.github.io/upload "Title")
### Installation
``` sh
npm install reactui-upload
```

### API

### props

|name|type|default| description|
|-----|---|--------|----|
|onDrop | function |- | 拖拽后的回调|
|onUpload | function | -| 上传中回调 |
|className | string | - | 上传控件自定义样式的className |
|maxSize | string | - | 最大图片尺寸|
|style | object | -| 控件样式 |
|supportClick | boolean | true| 是否支持点击 |
|accept | string | | 上传类型 |
|multiple | boolean | false | 是否可多次上传|
|onComplete | function| |上传完成的回调 |
|uploadUrl| string| | 上传的url |
### Demo

``` sh
npm run start
```

http://localhost:8888/example/

### Usage
``` javascript
<Upload />
```
