/**
 * Created by zx1984 5/16/2018
 * https://github.com/zx1984
 */
const d = document
export default {
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
  query (selector, context = d) {
    return context.querySelector(selector)
  },
  appendToBody ($el) {
    const $body = this.query('body')
    if ($body) {
      $body.appendChild($el)
      return true
    }
    return false
  }
}
