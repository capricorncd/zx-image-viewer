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

export function filterOptions (opts) {
  let keys = opts.keyboard
  return opts
}
