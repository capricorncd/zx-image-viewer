/**
 * Create by zx1984
 * 2018/5/16 0016.
 * https://github.com/zx1984
 */
import '../style/image-preview.styl'
import util from './util'
import dom from './dom'
import ic from './img-controls'

// 默认配置
const __DEFAULT = {
  // 显示上一张/下一张箭头
  showSwitchArrow: true,
  // 缩放
  scale: true,
  // 旋转
  rotate: true,
  // 移动
  move: true,
  // 缩略图选择器
  thumbSelector: 'img',
  // 按键配置
  keys: {
    prev: 'left',
    next: 'right',
    // [放大，缩小]
    scale: 'wheel',
    // [Clockwise 顺时针, anticlockwise 逆时针]
    rotate: ['up', 'down'],
    close: 'esc'
  }
}

const log = console.log

const Z_INDEX = 9999

class ZxImageView {
  constructor (opts) {
    // 初始化参数
    this.opts = util.isObject(opts) ? util.extend({}, __DEFAULT, opts) : __DEFAULT
    this._init()
    if (arguments.length > 1) {
      // dom元素
      if (util.isHTMLElement(arguments[1])) {
        this.init(arguments[1])
      } else if (typeof opts === 'string') {
        // 缩略图标识
        this.thumbSelector = opts
      }
    }
  }

  // 内部初始化
  _init () {
    const opts = this.opts
    // log(opts)
    // preview是否显示
    this.isPreview = false
    // 预览容器
    this.$container = dom.create({
      tag: 'div',
      attrs: {
        class: 'zx-image-preview-wrapper',
        style: 'display:none'
      },
      child: [
        {
          tag: 'div',
          attrs: {
            class: 'zip-arrow _prev-arrow'
          }
        },
        {
          tag: 'div',
          attrs: {
            class: 'zip-arrow _next-arrow'
          }
        }
      ]
    })
    // 关闭按钮
    this.$close = dom.create({
      tag: 'div',
      attrs: {
        class: 'zip-close _cur'
      }
    })
    // 预览图片
    this.$img = dom.create({
      tag: 'img',
      attrs: {
        class: 'zip-picture v-transition'
      }
    })
    // 工具栏
    this.$tool = dom.create({
      tag: 'div',
      attrs: {
        class: 'zip-tool-wrapper'
      },
      child: [
        // {
        //   tag: 'span',
        //   attrs: {
        //     class: '_item _rotate-hook'
        //   },
        //   child: ['旋转']
        // }
      ]
    })
    // 数量栏
    this.$totalBar = dom.create({
      tag: 'div',
      attrs: {
        class: 'zip-totalbar-wrapper'
      }
    })
    this.$container.appendChild(this.$close)
    this.$container.appendChild(this.$img)
    this.$container.appendChild(this.$tool)
    this.$container.appendChild(this.$totalBar)
    // 是否添加到body
    this.isAppendToBody = dom.appendToBody(this.$container)
    // 图片元素数据
    this.$images = []
    // 缩略图容器
    this.$thumbContailner = null
    this.index = 0
    // 事件处理器
    this._eventHandler()
    this.thumbSelector = opts.thumbSelector

    if (!opts.showSwitchArrow) {
      this.togglePrev()
      this.toggleNext()
    }
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
      this.thumbSelector = selector
    }
    // 获取图片元素
    const $images = $itemContainer.querySelectorAll(this.thumbSelector)
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
      this.$totalBar.innerHTML = html
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
    this.$close.addEventListener('click', e => {
      e.stopPropagation()
      this.hide()
    })

    // 点击图片
    this.$img.addEventListener('click', e => {
      e.stopPropagation()
    })

    // 拖动图片
    ic.move(this.$img)

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
    this.$tool.addEventListener('click', e => {
      e.stopPropagation()
      const $el = e.target
      let isToolItem = dom.hasClass($el, '_item')
      if (!isToolItem) return
      // 旋转
      if (dom.hasClass($el, '_rotate-hook')) {
        this.rotate()
      }
      // log($el.className)
    })

    // 点击统计栏
    this.$totalBar.addEventListener('mouseover', e => {
      this._handleClickTotalBar(e)
    })

    // 点击统计栏
    this.$totalBar.addEventListener('click', e => {
      e.stopPropagation()
      // this._handleClickTotalBar(e)
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
          this.rotate()
          break
        // rotate down
        case 40:
          this.rotate(true)
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
      ic.scale($el, e)
    }
  }

  // 点击或鼠标滑过统计栏处理
  _handleClickTotalBar (e) {
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
    $el = $el || this.$totalBar.querySelectorAll('._item')[this.index]
    const $active = dom.query('._item-active', this.$totalBar)
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
  rotate (isAnticlockwise) {
    let deg = isAnticlockwise ? -90 : 90
    const angle = util.int(dom.attr(this.$img, 'rotate-angle')) + deg
    dom.attr(this.$img, 'rotate-angle', angle)
    ic.rotate(this.$img, angle)
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
