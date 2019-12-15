/*
 * @Author: 胡海
 * @Date: 2019-12-09 21:23:49
 * @LastEditors: 胡海
 * @LastEditTime: 2019-12-14 22:35:07
 * @Description: 
 */
// 这个地方需要优化的是切换按钮逻辑
// 三个组件
// 音乐组件有点难度，音乐的播放状态切换是更具组件的销毁来决定的所以音乐数据中间要有别的数据
// 更具数据的不同状态来显示不同的组件
// 喜欢功能还没有做
import {
  ClassModel
} from '../../models/class.js'
const classModel = new ClassModel()
Page({

  /**
   * 页面的初始数据
   */

  data: {
    classic: null, // 整个页面的数据
    leftDisable: true, // 左边边按钮隐藏
    rightDisable: false, // 右边按钮隐藏
    likeCount: 0, // 点赞总数
    likeStatus: false, // 当前用户是否点赞
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad(options) {
    this._getPlaylist()
  },

  onLike: function (event) { // 点赞时候要做的事
    const behavior = event.detail.behavior
    classModel.Like({
        url: behavior,
        uid: this.data.classic._id
      })
      .then(res => {
        console.log(res)
      })
  },

  onLeft: function (event) { // 点击上一期
    this._upDateClass('Left')
  },

  onRight: function (event) { // 点击下一期
    this._upDateClass('Right')
  },
  _upDateClass(url) { // 跟新期刊
    // 1根据index判断按钮显示
    // 写入缓存 确定key
    //我有必要把逻辑全写在这儿吗？
    let index = this.data.classic.index
    let key = url == 'Left' ? classModel.getKey(index + 1) : classModel.getKey(index - 1)
    let classic = wx.getStorageSync(key)
    if (!classic) {
      classModel.getClassRightOrLeft({
        url,
        index
      }).then(res => {
        let data = res.result.data[0]
        this._getLike(data._id)
        wx.setStorageSync(key, data)
        this.setData({
          leftDisable: classModel.isMaxIndex(data.index),
          rightDisable: classModel.isMIniIndex(data.index),
          classic: data
        })
      })
    } else {
      this._getLike(classic._id)
      this.setData({
        leftDisable: classModel.isMaxIndex(classic.index),
        rightDisable: classModel.isMIniIndex(classic.index),
        classic
      })
    }
  },
  _getPlaylist() { // 获取到最新一期
    wx.showLoading({
      title: '加载中',
    })
    classModel.getClassLast()
      .then(res => {
        let data = res.result.data[0]
        this._getLike(data._id)
        classModel.setLatestIndex(data.index)
        this.setData({
          classic: data
        })
        wx.hideLoading()
      })
  },
  _getLike(uid) {// 获取点赞状态and 数量
    classModel.getLike({
        uid
      })
      .then(res => {
        let data = res.result
        this.setData({
          likeCount: data.like_nums,
          likeStatus: data.status
        })
      })
  }
})