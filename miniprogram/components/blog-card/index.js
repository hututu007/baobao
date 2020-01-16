/*
 * @Author: 胡海
 * @Date: 2020-01-16 22:32:32
 * @LastEditors  : 胡海
 * @LastEditTime : 2020-01-16 22:35:23
 * @Description: 
 */
// components/blog-card/blog-card.js
import formatTime from '../../util/formatTime.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object
  },

  observers: {
    ['blog.createTime'](val) {
      if (val) {
        // console.log(val)
        this.setData({
          _createTime: formatTime(new Date(val))
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _createTime: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onPreviewImage(event) {// 预览图片
      const ds = event.target.dataset
      wx.previewImage({
        urls: ds.imgs,
        current: ds.imgsrc,
      })
    },
  }
})