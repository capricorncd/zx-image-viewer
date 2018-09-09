/**
 * Created by zx1984 9/9/2018
 * https://github.com/zx1984
 */
/**
 * WindowSize
 */
export default class WinSize {
  constructor () {
    this.width = 0
    this.height = 0
    this.init()
    window.addEventListener('resize', _ => {
      this.init()
    })
  }

  init () {
    this.width = window.innerWidth
    this.height = window.innerHeight
  }
}
