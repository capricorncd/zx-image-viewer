/**
 * Create by capricorncd
 * 2018/5/16 0016.
 * https://github.com/capricorncd
 */
import util from './util'
import dom from './dom'
import WinSize from './window-size'
import { touchEvents } from './touch-event'
// 缩小最小尺寸限制
const MIN_SIZE = 60
const win = new WinSize()
// 边界限制，屏幕宽度的30%
const boundary = win.width * 0.3
// 禁止图片被选中
document.onselectstart = new Function('event.returnValue=false')
export default {
  /**
   * 缩放
   * @param $img 缩放对象
   * @param wheelDelta > 0放大或 < 0缩小
   */
  scale ($img, wheelDelta) {
    if (wheelDelta > 0) {
      // 放大
      this._scaleHandler($img, true)
    } else {
      // 缩小
      this._scaleHandler($img)
    }
  },

  // @param isEnlarge 是否放大
  _scaleHandler ($img, isEnlarge) {
    let naturalWidth = $img.naturalWidth
    // let naturalHeight = $img.naturalHeight
    let imgWidth = $img.width
    let imgHeight = $img.height
    let iw, ih
    if (isEnlarge) {
      iw = imgWidth * 1.4
      // 最大放大2倍
      if (iw >= naturalWidth * 3) return
    } else {
      // 图片实际尺寸小于最小限制尺寸
      if (naturalWidth < MIN_SIZE) return
      iw = imgWidth * 0.6
      if (iw <= MIN_SIZE) return
    }
    ih = iw * imgHeight / imgWidth
    $img.style.width = iw + 'px'
    $img.style.height = ih + 'px'
    // 图片增加的宽度、高度
    let addW = iw - imgWidth
    let addH = ih - imgHeight
    let css = util.getStyleValue($img)
    $img.style.top = util.int(util.toNumber(css.top) - addH / 2) + 'px'
    $img.style.left = util.int(util.toNumber(css.left) - addW / 2) + 'px'
  },

  // 旋转
  rotate ($img, angle) {
    // ie9及以下浏览器禁用旋转
    if (util.isLeIE9()) angle = 0
    // console.error(angle)
    $img.style.transform = `rotate(${angle}deg)`
    // console.log(this.$img)
    this._initImagePosition($img, angle)
  },

  // 移动， 拖动
  move ($img) {
    // 鼠标在图片上按下
    let isMousedownOnImage = false
    // isTouchEvent
    let isTouchEvent = false
    // 鼠标按下位置图片左上角位置
    let moveBeforePostion = {}
    // 图片是否旋转
    let isRotate = false
    // 图片宽高差
    let halfImgSizeDifference = 0
    // 竖图
    let isVerticalImage = false
    // 开始
    $img.addEventListener(touchEvents.start, e => {
      // log(e.type)
      // 防止触发浏览器图片拖动行为
      e.preventDefault()
      isMousedownOnImage = true

      isTouchEvent = e.type === 'touchstart'

      // prevent user enter with right and the swiper move (needs isTouchEvent)
      if (!isTouchEvent && 'which' in e && e.which === 3) {
        isMousedownOnImage = false
        return
      }

      if (!isTouchEvent || e.targetTouches.length === 1) {
        if (!isTouchEvent && !util.isAndroid()) {
          if (e.preventDefault) {
            e.preventDefault()
          } else {
            e.returnValue = false
          }
        }

        let pageX = isTouchEvent ? e.targetTouches[0].pageX : (e.pageX || e.clientX)
        let pageY = isTouchEvent ? e.targetTouches[0].pageY : (e.pageY || e.clientY)

        moveBeforePostion.x = pageX - $img.offsetLeft
        moveBeforePostion.y = pageY - $img.offsetTop
        dom.rmClass($img, 'v-transition')
      }
      // 是否旋转
      let angle = $img.getAttribute('rotate-angle')
      if (/^(\d+)/.test(angle)) {
        isRotate = RegExp.$1 / 90 % 2 === 1
      }
      // 图片宽高差
      let imgPos = $img.getBoundingClientRect()
      halfImgSizeDifference = Math.abs(imgPos.width - imgPos.height) / 2
      // 竖图
      isVerticalImage = $img.width < $img.height
    })

    let l, t
    // 拖动
    document.addEventListener(touchEvents.move, e => {
      if (!isMousedownOnImage) return
      if (!isTouchEvent && !util.isAndroid()) {
        if (e.preventDefault) {
          e.preventDefault()
        } else {
          e.returnValue = false
        }
      }

      let pageX = isTouchEvent ? e.targetTouches[0].pageX : (e.pageX || e.clientX)
      let pageY = isTouchEvent ? e.targetTouches[0].pageY : (e.pageY || e.clientY)

      l = pageX - moveBeforePostion.x
      t = pageY - moveBeforePostion.y
      // ie11 无x/y属性
      let imgPos = $img.getBoundingClientRect()
      // Boundary restriction
      // Right boundary
      let rightBoundary = isRotate
        ? (isVerticalImage ? win.width + halfImgSizeDifference - boundary : win.width - halfImgSizeDifference - boundary)
        : win.width - boundary
      if (rightBoundary <= l) {
        l = rightBoundary
      }
      // Left boundary
      let leftBoundary = isRotate
        ? (isVerticalImage ? boundary - imgPos.width + halfImgSizeDifference : boundary - imgPos.width - halfImgSizeDifference)
        : boundary - imgPos.width
      if (l <= leftBoundary) {
        l = leftBoundary
      }
      // Bottom boundary
      let bottomBoundary = isRotate
        ? (isVerticalImage ? win.height - halfImgSizeDifference - boundary : win.height + halfImgSizeDifference - boundary)
        : win.height - boundary
      if (bottomBoundary <= t) {
        t = bottomBoundary
      }
      // Top boundary
      let topBoundary = isRotate
        ? (isVerticalImage ? boundary - imgPos.height - halfImgSizeDifference : boundary - imgPos.height + halfImgSizeDifference)
        : boundary - imgPos.height
      if (t <= topBoundary) {
        t = topBoundary
      }

      $img.style.left = l + 'px'
      $img.style.top = t + 'px'
    })

    // 释放鼠标
    document.addEventListener(touchEvents.end, e => {
      isMousedownOnImage = false
      dom.addClass($img, 'v-transition')
    })
  },

  // 设置图片显示尺寸及位置
  _initImagePosition ($img, angle) {
    // 是否旋转
    const isRotate = util.int(angle / 90) % 2
    let imgWidth, imgHeight, iw, ih, winRatio, imgRatio
    // 屏幕尺寸
    const winWidth = window.innerWidth
    const winHeight = window.innerHeight
    winRatio = winWidth / winHeight
    // 图片原始尺寸
    imgWidth = $img.naturalWidth
    imgHeight = $img.naturalHeight
    imgRatio = imgWidth / imgHeight

    if (isRotate) {
      imgRatio = imgHeight / imgWidth
      if (imgRatio > winRatio) {
        ih = imgHeight > winWidth * 0.9 ? winWidth * 0.9 : imgHeight
        iw = ih * imgWidth / imgHeight
        $img.style.width = iw + 'px'
        $img.style.height = ih + 'px'
        // $img.style.top = (winHeight - ih) / 2 + 'px'
      } else {
        iw = imgWidth > winHeight * 0.9 ? winHeight * 0.9 : imgWidth
        ih = iw * imgHeight / imgWidth
        $img.style.width = iw + 'px'
        $img.style.height = ih + 'px'
      }
      // $img.style.top = (winHeight - ih) / 2 + 'px'
      // $img.style.left = (winWidth - iw) / 2 + 'px'
    } else {
      if (imgRatio > winRatio) {
        iw = imgWidth > winWidth * 0.9 ? winWidth * 0.9 : imgWidth
        ih = iw * imgHeight / imgWidth
        $img.style.width = iw + 'px'
        $img.style.height = ih + 'px'
        // $img.style.top = (winHeight - ih) / 2 + 'px'
      } else {
        ih = imgHeight > winHeight * 0.9 ? winHeight * 0.9 : imgHeight
        iw = ih * imgWidth / imgHeight
        $img.style.width = iw + 'px'
        $img.style.height = ih + 'px'
      }
    }
    $img.style.top = (winHeight - ih) / 2 + 'px'
    $img.style.left = (winWidth - iw) / 2 + 'px'
    // console.log(winWidth, winHeight)
    // console.log(iw, ih)
    // console.log(imgRatio, winRatio)
  }
}
