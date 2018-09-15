/**
 * Created by capricorncd 5/16/2018
 * https://github.com/capricorncd
 */
import util from './util'
const d = document
export default {
  /**
   * 向$content中添加元素$child
   * @param $content
   * @param $child
   */
  append ($content, $child) {
    if (!$child) return
    if (util.isArray($child)) {
      for (let i = 0; i < $child.length; i++) {
        if ($child[i]) {
          $content.appendChild($child[i])
        }
      }
    } else {
      $content.appendChild($child)
    }
  },
  /**
   * 创建dom节点
   * @param vnode 虚拟dom节点配置对象
   * @returns {*}
   */
  create (vnode) {
    if (typeof vnode === 'string') return d.createTextNode(vnode)
    const tag = vnode.tag
    const attrs = vnode.attrs || {}
    const children = vnode.child || []
    if (!tag) return null
    const $el = d.createElement(tag)
    // attrs
    for (let attrName in attrs) {
      if (attrs.hasOwnProperty(attrName)) {
        $el.setAttribute(attrName, attrs[attrName])
      }
    }
    // children
    children.forEach(item => {
      $el.appendChild(this.create(item))
    })
    return $el
  },
  /**
   * 选择满足条件的dom节点
   * @param selector
   * @param context
   * @returns {Element}
   */
  query (selector, context = d) {
    return context.querySelector(selector)
  },
  /**
   * 选择满足条件的所有dom节点
   * @param selector
   * @param context
   * @returns {NodeList}
   */
  queryAll (selector, context = d) {
    return context.querySelectorAll(selector)
  },
  /**
   * 添加dom元素至body内
   * @param $el
   * @returns {boolean}
   */
  appendToBody ($el) {
    const $body = this.query('body')
    if ($body) {
      $body.appendChild($el)
      return true
    }
    return false
  },
  addClass ($el, cls) {
    if (!$el) return
    if (util.isLeIE9()) {
      this._className($el, cls)
    } else {
      $el.classList.add(cls)
    }
  },
  rmClass ($el, cls) {
    if (!$el) return
    if (util.isLeIE9()) {
      let className = this._className($el)
      let index = className.indexOf(cls)
      if (index !== -1) {
        className.splice(index, 1)
        $el.className = className.join(' ')
      }
    } else {
      $el.classList.remove(cls)
    }
  },
  hasClass ($el, cls) {
    if (!$el) return
    if (util.isLeIE9()) {
      let className = this._className($el)
      return className.indexOf(cls) > -1
    } else {
      return $el.classList.contains(cls)
    }
  },

  /**
   * 获取或新增$el样式名
   * @param $el
   * @param cls 字符串或数组
   * @returns {Array} 获取到的样式名数组
   */
  _className ($el, cls) {
    let result = []
    let cn = $el.className
    if (cn) {
      let arr, i, val
      arr = util.trim(cn).split(' ')
      for (i = 0; i < arr.length; i++) {
        val = arr[i]
        if (val) {
          result.push(val)
        }
      }
    }
    // 添加样式名
    if (cls) {
      if (typeof cls === 'string') {
        cls = cls.split(' ')
      }
      $el.className = result.concat(cls).join(' ')
    }
    // 获取样式名数组
    else {
      return result
    }
  },
  attr ($el, attr, value) {
    if (typeof value !== 'undefined') {
      $el.setAttribute(attr, value)
    } else {
      return $el.getAttribute(attr)
    }
  }
}
