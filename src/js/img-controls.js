/**
 * Create by zx1984
 * 2018/5/16 0016.
 * https://github.com/zx1984
 */
import util from './util'
import dom from './dom'
const MIN_SIZE = 60
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
    // 鼠标按下位置图片左上角位置
    let moveBeforePostion = {}
    // 开始
    $img.addEventListener('mousedown', e => {
      // log(e.type)
      // 防止触发浏览器图片拖动行为
      e.preventDefault()
      isMousedownOnImage = true
      moveBeforePostion.x = e.clientX - $img.offsetLeft
      moveBeforePostion.y = e.clientY - $img.offsetTop
      dom.rmClass($img, 'v-transition')
    })

    let l, t
    // 拖动
    document.addEventListener('mousemove', e => {
      if (!isMousedownOnImage) return
      e.preventDefault()

      l = e.clientX - moveBeforePostion.x
      t = e.clientY - moveBeforePostion.y

      $img.style.left = l + 'px'
      $img.style.top = t + 'px'
    })

    // 释放鼠标
    document.addEventListener('mouseup', e => {
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
