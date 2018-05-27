# image-view

图片预览插件，支持图片切换、旋转、缩放、移动...

浏览器支持：IE10+, (IE9不支持旋转功能)

## 键盘操作

> 方向键：左`left`右`right`前后图片切换，上`up`下`down`顺时针逆时针旋转

> 滚动鼠标：缩放

## 使用 use

浏览器Brower

```html
<div id="imgList">
  <img src="a.jpg">
  <img src="b.jpg">
  <img src="c.jpg">
  <img src="d.jpg">
</div>
<script src="dist/js/zx-image-view.min.js"></script>
<script>
  // 获取图片容器dom元素
  var $el = document.getElementById('imgList');
  // 初始化参数
  var options = {};

  // 使用方法1
  var ziv = new ZxImageView(options);
  ziv.init($el, 'img');

  // 使用方法2
  var ziv2 = new ZxImageView(options, $el, 'img');
</script>
```

npm

```
npm install zx-image-view --save-dev
```

ES6+
```javascript
import { ZxImageView } from 'zx-image-view'
```

## # 效果图 preview

![image-view](resource/view-1.jpg)

![image-view](resource/view-2.jpg)

## 参数 options

|参数|类型|说明|
|:--|:--|:--|
|backgroundOpacity|Floor|背景遮罩(黑色)透明度，取值`0-1`，默认值`0.6`|
|paginationable|Boolean|分页mouseover切换图片，默认值`true`|
|movable|Boolean|移动图片，默认值`true`|
|rotatable|Boolean|旋转图片，默认值`true`|
|scalable|Boolean|缩放图片，默认值`true`|
|showClose|Boolean|显示关闭预览窗口按钮，默认值`true`|
|showPagination|Boolean|显示分页栏，默认值`true`|
|showSwitchArrow|Boolean|显示左右切换箭头按钮，默认值`true`|
|showToolbar|Boolean|显示工具栏，默认值`false`|
|thumbSelector|String|缩略图选择器，默认值`img`。调用`init([], thumbSelector)`方法时可以覆盖此属性|

## 方法 methods

* init()

## Copyright and license

Code and documentation copyright 2018. zx1984. Code released under the MIT License.
