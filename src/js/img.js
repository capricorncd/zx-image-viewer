/**
 * Create by zx1984
 * 2018/5/16 0016.
 * https://github.com/zx1984
 */
import util from './util'
const MIN_SIZE = 60
export default {
  /**
   * 缩放
   */
  scale ($img, e) {
    let wheelDelta = e.wheelDelta
    if (wheelDelta > 0) {
      // 放大
      this._scaleHandler($img, e, true)
    } else {
      // 缩小
      this._scaleHandler($img, e)
    }
  },

  // @param isEnlarge 是否放大
  _scaleHandler ($img, e, isEnlarge) {
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
    $img.style.marginTop = util.toNumber(css.marginTop) - addH / 2 + 'px'
    $img.style.marginLeft = util.toNumber(css.marginLeft) - addW / 2 + 'px'
  },

  // 旋转
  rotate ($img, angle) {
    // console.error(angle)
    $img.style.transform = `rotate(${angle}deg)`
    // console.log(this.$img)
    this._initImagePosition($img, angle)
  },

  // 移动
  move ($img, e) {},

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
        // $img.style.marginTop = (winHeight - ih) / 2 + 'px'
      } else {
        iw = imgWidth > winHeight * 0.9 ? winHeight * 0.9 : imgWidth
        ih = iw * imgHeight / imgWidth
        $img.style.width = iw + 'px'
        $img.style.height = ih + 'px'
      }
      // $img.style.marginTop = (winHeight - ih) / 2 + 'px'
      // $img.style.marginLeft = (winWidth - iw) / 2 + 'px'
    } else {
      if (imgRatio > winRatio) {
        iw = imgWidth > winWidth * 0.9 ? winWidth * 0.9 : imgWidth
        ih = iw * imgHeight / imgWidth
        $img.style.width = iw + 'px'
        $img.style.height = ih + 'px'
        // $img.style.marginTop = (winHeight - ih) / 2 + 'px'
      } else {
        ih = imgHeight > winHeight * 0.9 ? winHeight * 0.9 : imgHeight
        iw = ih * imgWidth / imgHeight
        $img.style.width = iw + 'px'
        $img.style.height = ih + 'px'
      }
    }
    $img.style.marginTop = (winHeight - ih) / 2 + 'px'
    $img.style.marginLeft = (winWidth - iw) / 2 + 'px'
    // console.log(winWidth, winHeight)
    // console.log(iw, ih)
    // console.log(imgRatio, winRatio)
  }
}
