/*
 * @Author: 胡海
 * @Date: 2020-01-16 22:02:43
 * @LastEditors: 胡海
 * @LastEditTime: 2020-01-16 22:03:55
 * @Description: 
 */
// components/search/search.js
let keyword = ''
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: '请输入关键字'
    }
  },
  externalClasses: [
    'iconfont',
    'icon-sousuo',
  ],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(event) {
      keyword = event.detail.value
    },

    onSearch() {
      // console.log(keyword)
      // blog
      this.triggerEvent('search', {
        keyword
      })
    },
  }
})