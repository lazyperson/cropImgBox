# Amaze UI CropImgBox
---

[CropImgBox 插件](https://github.com/kenwheeler/slick) Amaze UI 样式移植。

- [使用示例](http://amazeui.github.io/slick/docs/demo.html)
- [API 文档](http://amazeui.github.io/slick/docs/api.html)

**使用说明：**

1. 获取 Amaze UI CropImgBox

  - [直接下载](https://github.com/amazeui/slick/archive/master.zip)
  - 使用 NPM: `npm install amazeui-slick`

2. 在 Amaze UI 样式之后引入 slick 样式（`dist` 目录下的 CSS）：

  Amaze UI CropImgBox 依赖 Amaze UI 样式。

  ```html
  <link rel="stylesheet" href="path/to/amazeui.min.css"/>
  <link rel="stylesheet" href="path/to/amazeui.cropimgbox.min.css"/>
  ```

3. 引入 CropImgBox 插件（`dist` 目录下的 JS）：

  ```html
  <script src="path/to/jquery.min.js"></script>
  <script src="path/to/cropimgbox.min.js"></script>
  ```

4. 初始化 CropImgBox:

  ```js
  $(function() {
	var options =
		{
			thumbBox: '.cropimgbox-thumbBox',
			spinner: '.cropimgbox-spinner',
			imgSrc: ''
		}
    var cropper = $('.cropimgbox-imageBox').cropimgbox(options);
  });
  ```
