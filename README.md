# Amaze UI CropImgBox
---

[CropImgBox 插件](https://github.com/lazyperson/cropImgBox) Amaze UI 样式移植。

- [使用示例](https://lazyperson.github.io/cropImgBox/example/)
- [API 文档](https://github.com/lazyperson/cropImgBox/blob/master/docs/api.md)

**使用说明：**

1. 获取 Amaze UI CropImgBox

  - [直接下载](https://github.com/lazyperson/cropImgBox.git)
  - 使用 NPM: `npm install cropImgBox`

2. 在 Amaze UI 样式之后引入 CropImgBox 样式（`dist` 目录下的 CSS）：

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
