
# CropImgBox API
---

## 选项

选项 | 类型 | 默认值 | 描述
--- | ---- | ------- | -----------
thumbBox | string | `''` | 选取框对象
spinner      | string | `''` | 图像展示对象
expandRatio | integer | 1.1 | 放大倍率
narrowRatio      | integer | 0.9 | 缩小倍率

## 方法

```javascript
// init a cropimgbox
var options =
{
    thumbBox: '.cropimgbox-thumbBox',
    spinner: '.cropimgbox-spinner',
    imgSrc: ''
}
var cropper = $('.cropimgbox-imageBox').cropimgbox(options);

// Get the imgs
cropper.getDataURL(function (arrs) {
})

// expand image
cropper.zoomIn();

// narrow image
cropper.zoomOut();

//converted base64 to Blod for upload files
cropper.getBlob(i);
```

方法        | 参数      | 描述
------     | -------- | -----------
cropimgbox      | options : object | 初始化 cropimgbox
getDataURL    | callback  | 获取截取变换后的图像base64数组
zoomIn  |  | 放大
zoomOut  | | 缩小
getBlob  | i:int | 将base64转化为Blob,i为数组的下标
