/**
 * Created by zx1984 5/16/2018
 * https://github.com/zx1984
 */
const d = document
export default {
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
  }
}
