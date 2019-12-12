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
    latest: true, // 左边边按钮隐藏
    first: false, // 右边按钮隐藏
    likeCount: 0, // 点赞总数
    likeStatus: false, // 当前用户是否点赞
    resArr: [], // 所有期刊
    preIndex: 0, // 切换的序号
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad(options) {
    this._getPlaylist()
    this._getLike()
    classModel.getClassLast().then(res=>{
      console.log(res)
    })
  },

  onLike: function (event) { // 点赞时候要做的事
    const behavior = event.detail.behavior
    let status = behavior == 'like' ? 1 : 0
    console.log(status)
    wx.cloud.callFunction({
      name: 'class',
      data: {
        $url: 'likeEdit',
        status
      }
    }).then((res) => {

    })
  },

  onNext: function (event) { // 点击上一期
    let Arr = this.data.resArr
    let Index = this.data.preIndex - 1
    if (Index >= 0) {
      this.setData({
        classic: Arr[Index],
        preIndex: Index,
      })
    }
    this._btnStatus()
  },

  onPrevious: function (event) { // 点击下一期
    let Arr = this.data.resArr
    let Index = this.data.preIndex + 1
    if (Arr.length > Index) {
      this.setData({
        classic: Arr[Index],
        preIndex: Index,
      })
    }
    this._btnStatus()

  },
  _btnStatus() {
    if (this.data.preIndex > 0) {
      this.setData({
        latest: false,
      })
    }
    if (this.data.preIndex <= 0) {
      this.setData({
        latest: true,
      })
    }
    if (this.data.preIndex < this.data.resArr.length - 1) {
      this.setData({
        first: false,
      })
    }
    if (this.data.preIndex >= this.data.resArr.length - 1) {
      this.setData({
        first: true,
      })
    }
  },
  _getPlaylist() { // 获取到所有期刊的数据
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'class',
      data: {
        $url: 'classList',
      }
    }).then((res) => {
      this.setData({
        resArr: res.result.data,
        classic: res.result.data[0]
      })
      wx.hideLoading()
    })
  },
  _getLike() { // 获取当前用户的点赞状态
    wx.cloud.callFunction({
      name: 'class',
      data: {
        $url: 'likeStatus'
      }
    }).then((res) => {
      this.setData({
        likeStatus: res.result.data[0].status
      })
    })
  }
})