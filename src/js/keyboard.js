/**
 * Created by zx1984 5/18/2018
 * https://github.com/zx1984
 */
import util from './util'
// a-z
const LETTER = 'abcdefghijklmnopqrstuvwxyz'
// 键对应的number
const keyboards = {
  escape: 27, // esc
  // 主键盘
  backquote: 192, // `(~)
  digit1: 49, // 1(!)
  digit2: 50, // 2(@)
  digit3: 51, // 3(#)
  digit4: 52, // 4($)
  digit5: 53, // 5(%)
  digit6: 54, // 6(^)
  digit7: 55, // 7(&)
  digit8: 56, // 8(*)
  digit9: 57, // 9(()
  digit0: 48, // 0())
  equal: 187, // =(+)
  minus: 189, // -(-)
  bracketleft: 219, // [({)
  bracketright: 221, // ](})
  semicolon: 186, // ;(:)
  quote: 222, // '(")
  backslash: 220, // \(|)
  period: 190, // ,(>)
  comma: 188, // .(<)
  slash: 191, // /(?)
  space: 32, // spacebar
  // 数字键盘
  numpad0: 96,
  numpad1: 97,
  numpad2: 98,
  numpad3: 99,
  numpad4: 100,
  numpad5: 101,
  numpad6: 102,
  numpad7: 103,
  numpad8: 104,
  numpad9: 105,
  numpaddivide: 111, // /
  numpadmultiply: 106, // *
  numpadsubtract: 109, // -
  numpadadd: 107, // +
  numpaddecimal: 110, // .
  // 编辑键区
  insert: 45,
  home: 36,
  pageup: 33,
  delete: 46,
  end: 35,
  pagedown: 34,
  left: 37, // arrowleft
  right: 39, // arrowright
  up: 38, // arrowup
  down: 40 // arrowdown
}

// a键CODE
const A_CODE = 65
for (let i = 0; i < LETTER.length; i++) {
  keyboards[LETTER[i]] = A_CODE + i
}

// console.log(keyboards)

export default {
  // 获取keyCode
  code (keyname) {
    return keyboards[util.toLower(keyname)] || null
  }
}
