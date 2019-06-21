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

const BUTTONS_VNODE = {
  enlarge: {
    tag: 'span',
    attrs: {
      class: '_item'
    },
    child: [
      {
        tag: 'i',
        attrs: {
          class: 'zx zx-enlarge',
          title: '放大'
        }
      }
    ]
  },
  reduce: {
    tag: 'span',
    attrs: {
      class: '_item'
    },
    child: [
      {
        tag: 'i',
        attrs: {
          class: 'zx zx-reduce',
          title: '缩小'
        }
      }
    ]
  },
  rotate: {
    tag: 'span',
    attrs: {
      class: '_item'
    },
    child: [
      {
        tag: 'i',
        attrs: {
          class: 'zx zx-rotate',
          title: '旋转'
        }
      }
    ]
  },
  prev: {
    tag: 'span',
    attrs: {
      class: '_item'
    },
    child: [
      {
        tag: 'i',
        attrs: {
          class: 'zx zx-prev',
          title: '上一张'
        }
      }
    ]
  },
  next: {
    tag: 'span',
    attrs: {
      class: '_item'
    },
    child: [
      {
        tag: 'i',
        attrs: {
          class: 'zx zx-next',
          title: '下一张'
        }
      }
    ]
  }
}

/**
 * 创建工具栏按钮vnode
 * @param buttons
 * @returns {*}
 */
export function createToolbarButtons (buttons) {
  // map 根据配置，生成buttonvnode
  // filter 过滤掉item为undefined的元素，及BUTTONS[name]不存在的数据
  return Array.isArray(buttons) ? buttons.map(name => BUTTONS_VNODE[name]).filter(item => item) : []
}
