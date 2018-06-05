# image-view

图片预览插件，支持图片切换、旋转、缩放、移动...

浏览器支持：IE10+, (IE9不支持旋转功能)

## 默认键盘操作

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
  var options = {
    // 见参数说明处
  };

  // 使用方法1
  var imgArray1 = [
    'http://xxx.com/a.jpg',
    'http://xxx.com/b.jpg',
    'http://xxx.com/c.jpg',
    'http://xxx.com/d.jpg'
  ];
  var ziv1 = new ZxImageView(options, imgArray1);

  // 使用方法2
  var imgArray2 = [
    {
      url: 'http://xxx.com/a.jpg',
      // 默认选择角度
      angle: 90
    },
    {
      url: 'http://xxx.com/b.jpg',
      angle: 0
    },
    {
      url: 'http://xxx.com/c.jpg',
      angle: 180
    },
    {
      url: 'http://xxx.com/d.jpg'
      angle: 90
    }
  ];
  var ziv2 = new ZxImageView(imgArray2);

  // 使用方法3
  var ziv3 = new ZxImageView();
  ziv3.init(imgArray2);
</script>
```

npm

```
npm install zx-image-view --save-dev
# 或
npm i zx-image-view -D
```

ES6+
```javascript
import { ZxImageView } from 'zx-image-view'
```

开发调试

```
npm run start
# http://localhost:9000/
```

## # 效果图 preview

![image-view](resource/view-1.jpg)

![image-view](resource/view-2.jpg)

## 参数 options

|参数|类型|说明|
|:--|:--|:--|
|backgroundOpacity|Floor|背景遮罩(黑色)透明度，取值`0-1`，默认值`0.6`|
|keyboard|Object|键盘按钮(前/后一张、缩放、旋转、关闭)配置|
|paginationable|Boolean|分页mouseover切换图片，默认值`true`|
|movable|Boolean|移动图片，默认值`true`|
|rotatable|Boolean|旋转图片，默认值`true`|
|scalable|Boolean|缩放图片，默认值`true`|
|showClose|Boolean|显示关闭预览窗口按钮，默认值`true`|
|showPagination|Boolean|显示分页栏，默认值`true`|
|showSwitchArrow|Boolean|显示左右切换箭头按钮，默认值`true`|
|showToolbar|Boolean|显示工具栏，默认值`false`(待开发...)|

#### options.keyboard

|参数|类型|可选键名|说明|
|:--|:--|:--|:--|
|prev|String|任意键或`mousewheel`|上一张；为`mousewheel`时，next无效|
|next|String|任意键|下一张|
|scale|String或Array|任意键或`mousewheel`|图片缩放|
|rotate|String或Array|任意键或`mousewheel`|图片旋转|
|close|String|关闭图片查看器|

注意：参数中只能包含有且一个`mousewheel`配置；任何配置均不支持组合键。

keyboard参数可选属性见页尾--附录

```javascript
 // 初始化参数
let _config = {
  // 分页mouseover切换图片
  paginationable: true,
  // 显示关闭按钮
  showClose: true,
  // 显示上一张/下一张箭头
  showSwitchArrow: true,
  // 显示分页导航栏
  showPagination: true,
  // 缩放
  scalable: true,
  // 旋转
  rotatable: true,
  // 移动
  movable: true,
  // 键盘配置
  keyboard: {
    prev: 'a',
    next: 'd',
    rotate: ['up', 'down'],
    scale: 'mousewheel'
  }
}
new ZxImageView(_config);
```

## 方法 methods

* destroy() 销毁当前图片查看dom对象

* init(imageArray, index) 初始化图片数据

|参数|类型|必须|说明|
|:--|:--|:--|:--|
|imageArray|Array|是|图片url数组|
|index|Number|否|imageArray的索引，默认显示的第`index + 1`张图片；默认为`0`; 如果`index > imageArray.length`将被忽略|

* update(imageArray) 更新图片数据；与`init()`基本相同

|参数|类型|必须|说明|
|:--|:--|:--|:--|
|imageArray|Array|是|图片url数组|

* view(index, angle, imageArray) 查看第`index + 1`张图片

|参数|类型|必须|说明|
|:--|:--|:--|:--|
|index|Number|是|imageArray的索引，显示的第`index + 1`张图片|
|angle|Number|否|图片旋转角度，90的整数倍|
|imageArray|Array|否|图片url数组，将更新初始化的图片数组|

## 附录

支持自定义键盘按钮名/keyboard参数可选属性

|属性|键名/说明|
|:--|:--|
|escape|Esc键|
|主键盘| |
|backquote| `~` 键|
|digit1| `1(!)` 键 |
|digit2| `2(@)` 键 |
|digit3| `3(#)` 键 |
|digit4| `4($)` 键 |
|digit5| `5(%)` 键 |
|digit6| `6(^)` 键 |
|digit7| `7(&)` 键 |
|digit8| `8(*)` 键 |
|digit9| `9(()` 键 |
|digit0| `0())` 键 |
|equal| `=(+)` 键 |
|minus| `-(-)` 键 |
|a-z|`A`至`Z`键|
|bracketLeft| `[({)` 键 |
|bracketRight| `](})` 键 |
|semicolon| `;(:)` 键 |
|quote| `'(")` 键 |
|backslash| `\(|)` 键 |
|period| `,(>)` 键 |
|comma| `.(<)` 键 |
|slash| `/(?)` 键 |
|space| 空格键 |
|数字键盘||
|numpad0| 0 |
|numpad1| 1 |
|numpad2| 2 |
|numpad3| 3 |
|numpad4| 4 |
|numpad5| 5 |
|numpad6| 6 |
|numpad7| 7 |
|numpad8| 8 |
|numpad9| 9 |
|numpadDivide| `/`分或除 |
|numpadMultiply| `*`乘 |
|numpadSubtract| `-`减 |
|numpadAdd| `+`加 |
|numpadDecimal| `.`小数点 |
|编辑键区||
|insert| Insert 键 |
|home| Home 键 |
|end| End 键 |
|pageUp| PageUp 键 |
|pageDown| PageDown |
|delete| Delete 键 |
|left| 方向键左(ArrowLeft) |
|right| 方向键右(ArrowRight) |
|up| 方向键上(ArrowUp) |
|down| 方向键下(ArrowDown) |

|鼠标滚动|说明|
|:--|:--|
|mousewheel|鼠标滚动键|

## Copyright and license

Code and documentation copyright 2018. zx1984. Code released under the MIT License.
