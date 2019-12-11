import { HTTP } from '../util/request.js'
class ClassModel extends HTTP {
  getClassLast() {
    return this.request({
      cloudFn:'class',
      url:'class/last'
    })
  }

  getHot() {
    return this.request({
      url: '/book/hot_keyword'
    })
  }

  addToHistory(keyword) {
    let words = this.getHistory()
    const has = words.includes(keyword)
    // 队列 栈
    if (!has) {
      // 数组末尾 删除 ， keyword 数组第一位
      const length = words.length
      if (length >= this.maxLength) {
        words.pop()
      }
      words.unshift(keyword)
      wx.setStorageSync(this.key, words)
    }
  }

}

export {
  ClassModel
}