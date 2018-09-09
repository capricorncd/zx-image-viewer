/**
 * 日期数字双位数化
 * @param n
 * @returns {*}
 */
function doubleDigit (n) {
  // 转字符串
  n += ''
  return n[1] ? n : '0' + n
}

/**
 * 日期对象格式化
 * @param date
 * @param formatString
 * @returns {*}
 */
function formatDate (date, formatString) {
  if (typeof formatString === 'undefined' && typeof date === 'string') {
    formatString = date
    date = new Date()
  }

  if (!date || date === 'Invalid Date' || !(date instanceof Date)) return date
  if (/(y+)/i.test(formatString)) {
    formatString = formatString.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let obj = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let key in obj) {
    if (new RegExp(`(${key})`).test(formatString)) {
      let str = obj[key] + ''
      formatString = formatString.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : doubleDigit(str))
    }
  }
  return formatString
}

/**
 * 创建引用资源（css、js）标签
 * 创建link或script标签
 * @param urls 资源url地址
 * @param type 类型
 * @returns {string}
 */
function createCiteResourceLabel (urls, type) {
  // check params
  if (!urls || !type) return ''
  // url数据类型检测
  // 转数组
  let arr = []
  if (Array.isArray(urls)) {
    arr = urls
  } else {
    arr.push(urls)
  }
  // 生成标签字符串
  let temp = type === 'link'
    ? `<link rel="stylesheet" href="{url}">`
    : `<script src="{url}"></script>`
  // 替换标签字符串
  let s = ''
  arr.forEach(url => {
    s += temp.replace('{url}', url)
  })
  // 返回标签字符串
  return s
}

/**
 * 去字符串首尾空格
 * @param str
 * @returns {*}
 */
function trim (str) {
  return str ? str.replace(/^\s*|\s*$/g, '') : ''
}

// exports
module.exports = {
  formatDate,
  createCiteResourceLabel,
  trim
}
