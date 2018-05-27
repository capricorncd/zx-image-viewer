/**
 * Create by zx1984
 * 2018/5/16 0016.
 * https://github.com/zx1984
 */
import '../style/image-preview.styl'
import util from './util'
import dom from './dom'
import ic from './img-controls'

window.util = util

// 默认配置参数
const __DEFAULT = {
  // 背景遮罩透明度[0-1]
  // backgroundOpacity: .6,
  // 分页mouseover切换图片
  paginationable: false,
  // 显示关闭按钮
  showClose: true,
  // 显示上一张/下一张箭头
  showSwitchArrow: true,
  // 显示工具栏
  showToolbar: false,
  // 显示分页导航栏
  showPagination: true,
  // 缩放
  scalable: true,
  // 旋转
  rotatable: true,
  // 移动
  movable: true,
  // 缩略图选择器
  thumbSelector: 'img',
  // 按键配置
  keys: {
    prev: 'left',
    next: 'right',
    // 滚动鼠标[放大，缩小]
    scale: 'mousewheel',
    // [Clockwise 顺时针, anticlockwise 逆时针]
    rotate: ['up', 'down'],
    close: 'esc'
  }
}

const log = console.log

const Z_INDEX = 9999

class ZxImageView {
  constructor (opts, arr, selector) {
    let options, list, thumbSelector

    if (selector && typeof selector === 'string') {
      thumbSelector = selector
    }

    if (util.isHTMLElement(arr) || util.isArray(arr)) {
      list = arr
    } else if (typeof arr === 'string' && !thumbSelector) {
      thumbSelector = arr
    }

    if (util.isObject(opts)) {
      options = opts
    } else if ((util.isHTMLElement(opts) || util.isArray(opts)) && !list) {
      list = opts
      options = __DEFAULT
    }

    // 初始化参数
    this.opts = util.isObject(options) ? util.assign({}, __DEFAULT, options) : __DEFAULT
    this.opts.thumbSelector = thumbSelector || 'img'
    this._init()
    // 初始化数据
    if (util.isHTMLElement(list) || util.isArray(opts)) {
      this.init(list, thumbSelector)
    }
  }

  // 内部初始化
  _init () {
    const opts = this.opts
    log(opts)
    // 预览容器dom结构对象
    const vnode = {
      tag: 'div',
      attrs: {
        class: 'zx-image-preview-wrapper',
        style: 'display:none'
      },
      child: [
        // 预览图片
        {
          tag: 'img',
          attrs: {
            class: 'zip-picture v-transition'
          }
        }
      ]
    }
    // 显示左右箭头
    if (opts.showSwitchArrow) {
      // 左右方向箭头
      vnode.child.push({tag: 'div', attrs: {class: 'zip-arrow _prev-arrow'}})
      vnode.child.push({tag: 'div', attrs: {class: 'zip-arrow _next-arrow'}})
    }
    // 显示关闭按钮
    if(opts.showClose) {
      vnode.child.push({tag: 'div', attrs: {class: 'zip-close _cur'}})
    }
    // 工具栏
    if (opts.showToolbar) {
      vnode.child.push({
        tag: 'div',
        attrs: {
          class: 'zip-tool-wrapper'
        },
        child: [
          {
            tag: 'span',
            attrs: {
              class: '_item _rotate-hook'
            },
            child: ['旋转']
          }
        ]
      })
    }
    // 数量、统计栏
    if (opts.showPagination) {
      vnode.child.push({tag: 'div', attrs: {class: 'zip-totalbar-wrapper'}})
    }

    // 创建dom结构
    // 预览容器
    this.$container = dom.create(vnode)
    // 关闭按钮
    this.$close = dom.query('.zip-close', this.$container)
    // 预览图片
    this.$img = dom.query('.zip-picture', this.$container)
    // 工具栏
    this.$tool = dom.query('.zip-tool-wrapper', this.$container)
    // 分页栏
    this.$pagination = dom.query('.zip-totalbar-wrapper', this.$container)

    // 背景透明度
    if (typeof opts.backgroundOpacity !== 'undefined') {
      const bo = util.toNumber(opts.backgroundOpacity)
      this.$container.style.background = `rgba(0, 0, 0, ${bo})`
    }

    // preview是否显示
    this.isPreview = false
    // 是否添加到body
    this.isAppendToBody = dom.appendToBody(this.$container)
    // 图片元素数据
    this.$images = []
    // 缩略图容器
    this.$thumbContailner = null

    this.index = 0
    // 事件处理器
    this._eventHandler()
  }

  // 初始化
  init ($itemContainer, selector) {
    if (!this.isAppendToBody) {
      this.isAppendToBody = dom.appendToBody(this.$container)
    }
    if (!util.isHTMLElement($itemContainer)) {
      throw new Error(`init参数${$itemContainer}非html元素`)
    }
    this._thumbBindEvent($itemContainer)
    if (typeof selector === 'string') {
      this.opts.thumbSelector = selector
    }
    // 获取图片元素
    const $images = $itemContainer.querySelectorAll(this.opts.thumbSelector)
    this._reset$Images($images)
  }

  // 重置图片thumb列表数据
  _reset$Images ($images) {
    if ($images) {
      let html = ''
      this.$images = util.slice($images)
      let len = this.$images.length
      this.$images.forEach((item, index) => {
        html += `<i style="width:${Math.floor(1 / len * 100)}%" data-index="${index}" class="_item${this.index === index ? ' _item-active' : ''}"></i>`
      })
      this.$pagination.innerHTML = html
      this._checkArrowPrevNext()
    }
  }

  // 更新数据
  update ($images, index = 0) {
    if ($images instanceof NodeList) {
      this._reset$Images($images)
    }
  }

  push ($images) {
    if ($images instanceof NodeList) {
      let $newArr = this.$images.concat(util.slice($images))
      this._reset$Images($newArr)
    }
  }

  // 销毁对象
  destroy () {
    const $body = dom.query('body')
    try {
      $body.removeChild(this.$container)
      this.$container = null
    } catch (e) {}
  }

  // 缩略图事件绑定
  _thumbBindEvent ($itemContainer) {
    // 缩略图容器
    if (this.$thumbContailner && $itemContainer !== this.$thumbContailner) {
      this.$thumbContailner.removeEventListener('click', e => {
        this._thumbClickHandler(e)
      })
    }
    this.$thumbContailner = $itemContainer
    this.$thumbContailner.addEventListener('click', e => {
      this._thumbClickHandler(e)
    })
  }

  // 缩略图容器事件处理
  _thumbClickHandler (e) {
    const $img = e.target
    const isItem = this.$images.some(item => item === $img)
    if (!isItem) return
    this.show()
    this._resetCurrent$img($img)
    this._getThumbIndex($img)
    this._changeTotalBarClass()
  }

  // 获取当前图片index
  _getThumbIndex ($img) {
    const index = this.$images.indexOf($img)
    this.index = index !== -1 ? index : 0
    // console.error('this.index: ' + this.index)
  }

  // 重置当前图片
  _resetCurrent$img ($img) {
    $img = $img || this.$images[this.index]
    this.$img.src = $img.src
    // 获取设置的图片旋转角度
    const angle = util.int($img.getAttribute('rotate-angle'))
    // log('index.js _resetCurrent$img() angle: ' + angle)
    // 根据缩略图设置的旋转角度，重置预览图片的旋转角度
    dom.attr(this.$img, 'rotate-angle', angle)
    ic.rotate(this.$img, angle)
  }

  /**
   * 事件处理
   * @private
   */
  _eventHandler () {
    // 关闭
    this.$close && this.$close.addEventListener('click', e => {
      e.stopPropagation()
      this.hide()
    })

    // 点击图片
    this.$img.addEventListener('click', e => {
      e.stopPropagation()
    })

    // 拖动图片
    if (this.opts.movable) {
      ic.move(this.$img)
    } else {
      this.$img.style.cursor = 'auto'
    }

    // 点击preview容器
    this.$container.addEventListener('click', e => {
      const $el = e.target
      if (dom.hasClass($el, '_prev-arrow')) {
        this.prev()
      } else if (dom.hasClass($el, '_next-arrow')) {
        this.next()
      } else {
        this.hide()
      }
    })

    // 工具栏点击事件
    this.$tool && this.$tool.addEventListener('click', e => {
      e.stopPropagation()
      const $el = e.target
      let isToolItem = dom.hasClass($el, '_item')
      if (!isToolItem) return
      // 旋转
      if (dom.hasClass($el, '_rotate-hook')) {
        this._rotate()
      }
      // log($el.className)
    })

    // 点击统计栏
    this.$pagination && this.opts.paginationable && this.$pagination.addEventListener('mouseover', e => {
      // 处理事件
      this._handleChangePage(e)
    })

    // 点击统计栏，阻止事件冒泡
    this.$pagination && this.$pagination.addEventListener('click', e => {
      e.stopPropagation()
    })

    // 键盘事件
    window.addEventListener('keyup', e => {
      if (!this.isPreview) return
      // 阻止方向键移动元素或滚动条
      e.preventDefault()
      let keyCode = e.keyCode
      // log(keyCode, e.key, e.code, e.which)
      // log(e)
      switch (keyCode) {
        // prev
        case 37:
          this.prev()
          break
        // next
        case 39:
          this.next()
          break
        // rotate up
        case 38:
          this._rotate()
          break
        // rotate down
        case 40:
          this._rotate(true)
          break
        case 27:
          this.hide()
          break
      }
      // e.preventDefault()
    })

    // 鼠标滚动事件
    window.addEventListener('mousewheel', wheelHandler)
    // 火狐鼠标滚动事件
    window.addEventListener('DOMMouseScroll', wheelHandler)

    const _this = this

    function wheelHandler (e) {
      if (!_this.isPreview) return
      // log(e)
      const $el = e.target
      if ($el !== _this.$img) return
      // 浏览器兼容处理
      // 鼠标滚动方向
      let wheelDelta = e.wheelDelta || -e.detail
      _this._scale(wheelDelta)
    }
  }

  // 点击或鼠标滑过统计栏处理
  _handleChangePage (e) {
    if (this.$images.length <= 1) return
    // e.stopPropagation()
    const $el = e.target
    let isToolItem = dom.hasClass($el, '_item')
    if (!isToolItem) return
    let index = dom.attr($el, 'data-index') >>> 0
    // 当前点击index和this.index相同
    if (this.index === index) return
    this.index = index
    this._changeTotalBarClass($el)
    this._resetCurrent$img()
  }

  // 修改统计栏item样式
  _changeTotalBarClass ($el) {
    $el = $el || this.$pagination.querySelectorAll('._item')[this.index]
    const $active = dom.query('._item-active', this.$pagination)
    dom.rmClass($active, '_item-active')
    dom.addClass($el, '_item-active')
  }

  // 隐藏图片预览
  hide () {
    if (this.$container) {
      this.$container.style.display = 'none'
      this.isPreview = false
    }
  }

  // 显示图片预览
  show () {
    if (this.$container) {
      let zIndex = util.getMaxZindex()
      if (zIndex > Z_INDEX) {
        this.$container.style.zIndex = zIndex
      }
      this.$container.style.display = 'block'
      this.isPreview = true
    }
  }

  // 上一张
  prev () {
    this._switchImage('prev')
  }

  // 下一张
  next () {
    this._switchImage('next')
  }

  /**
   * 旋转
   * @param isAnticlockwise 是否逆时针
   */
  _rotate (isAnticlockwise) {
    // 禁止旋转
    if (!this.opts.rotatable) return
    let deg = isAnticlockwise ? -90 : 90
    const angle = util.int(dom.attr(this.$img, 'rotate-angle')) + deg
    dom.attr(this.$img, 'rotate-angle', angle)
    ic.rotate(this.$img, angle)
  }

  /**
   * 缩放
   * @private
   */
  _scale (wheelDelta) {
    // 禁止缩放
    if (!this.opts.scalable) return
    ic.scale(this.$img, wheelDelta)
  }

  // 切换
  _switchImage (type) {
    let maxIndex = this.$images.length - 1
    if (maxIndex <= 0) return
    switch (type) {
      case 'prev':
        if (+this.index === 0) {
          this.index = maxIndex
        } else {
          this.index--
        }
        break
      case 'next':
        if (+this.index >= maxIndex) {
          this.index = 0
        } else {
          this.index++
        }
        break
    }
    const $img = this.$images[this.index]
    this.$img.src = $img.src
    const angle = util.int(dom.attr($img, 'rotate-angle'))
    // 根据缩略图设置的旋转角度，重置预览图片的旋转角度
    dom.attr(this.$img, 'rotate-angle', angle)
    ic.rotate(this.$img, angle)
    this._changeTotalBarClass()
  }

  // 验证图片切换键是否显示
  _checkArrowPrevNext () {
    if (this.$images.length <= 1) {
      this.togglePrev()
      this.toggleNext()
    }
  }

  togglePrev (type) {
    const $el = dom.query('._prev-arrow', this.$container)
    $el.style.display = type === 'show' ? 'block' : 'none'
  }

  toggleNext (type) {
    const $el = dom.query('._next-arrow', this.$container)
    $el.style.display = type === 'show' ? 'block' : 'none'
  }
}

export { ZxImageView }
