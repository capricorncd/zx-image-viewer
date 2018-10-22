/**
 * Created by capricorncd 6/3/2018
 * https://github.com/capricorncd
 */
import util from './util'

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

/**
 * 格式化图片数组
 * @param images
 * @returns {*}
 */
export function fmtImageArray (images) {
  if (!util.isArray(images)) return null
  if (images.length === 0) return null
  let item = images[0]
  if (typeof item === 'string') {
    return images.map(url => {
      return { url }
    })
  } else {
    return item.url ? images : null
  }
}

/**
 * 添加图标字体样式至head
 * @param dom
 * @returns {boolean}
 */
export function appendIconfontToHead (dom, iconfontUrl) {
  const cssVnode = {
    tag: 'link',
    attrs: {
      href: iconfontUrl,
      rel: 'stylesheet'
    }
  }

  try {
    dom.query('head').appendChild(dom.create(cssVnode))
    return true
  } catch (e) {
    return false
  }
}
