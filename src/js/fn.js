/**
 * Created by zx1984 6/3/2018
 * https://github.com/zx1984
 */
'use strict';

/**
 * 滚动鼠标事件
 * @param wheelHandler
 */
export function mouseWheel (wheelHandler) {
  // 鼠标滚动事件
  window.addEventListener('mousewheel', wheelHandler)
  // 火狐鼠标滚动事件
  window.addEventListener('DOMMouseScroll', wheelHandler)
}

/**
 * 过滤和验证配置参数
 * @param opts
 * @returns {*}
 */
export function filterOptions (opts) {
  let key, val, keyboard, arr
  keyboard = opts.keyboard
  arr = []
  if (keyboard.prev === 'mousewheel') {
    keyboard.next = null
  }
  for (key in keyboard) {
    val = keyboard[key]
    if (arr.indexOf(val) > -1) {
      throw new Error(`keyboard配置键名${val}重复!`)
    }
    arr.push(val)
  }
  return opts
}
