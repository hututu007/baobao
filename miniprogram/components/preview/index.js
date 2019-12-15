/*
 * @Author: 胡海
 * @Date: 2019-12-09 21:23:47
 * @LastEditors: 胡海
 * @LastEditTime: 2019-12-15 00:43:41
 * @Description: 
 */
// components/preview/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    classic: {
      type: Object,
      observer: function(newVal) {
        if (newVal) {
          var typeText = {
            1: "电影",
            2: "音乐",
            3: "句子"
          }[newVal.type]
        }
        this.setData({
          typeText
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    typeText:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap:function(event){
      this.triggerEvent('tapping',{
        cid:this.properties.classic.id,
        type:this.properties.classic.type
      },{})
    }
  }
})