/*
 * @Author: 胡海
 * @Date: 2019-12-09 21:23:49
 * @LastEditors  : 胡海
 * @LastEditTime : 2020-01-16 21:43:02
 * @Description: 
 */
import {
  promisic
} from '../../util/common.js'
import {
  ClassModel
} from '../../models/class.js'
const classModel = new ClassModel()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorized: false,
    userInfo: null,
    classics: null,
    isBlog: false,
    isLike: false,
  },

  onLoad() {
    this.getBlog()
  },

  onShow(options) {
    // 页面加载的时候干点啥
    this.userAuthorized1()
    this.getMyFavor()
    this.blogId = this.selectComponent("#blogId");
  },

  getMyFavor() { //喜欢的期刊列表
    classModel.getLikeList().then(res => {
      let data = res.result.data.data
      this.setData({
        classics: data
      })
    })
  },
  getBlog() { //
    classModel.getBlog().then(res => {
      let data = res.result.data.data[0].blogshow
      this.setData({
        isBlog: data,
        isLike: !data,
      })
    })
  },
  userAuthorized1() { // 监测用户是否已经授权过了
    promisic(wx.getSetting)()
      .then(data => {
        if (data.authSetting['scope.userInfo']) {
          return promisic(wx.getUserInfo)()
        }
        return false
      })
      .then(data => {
        if (!data) return
        this.setData({
          authorized: true,
          userInfo: data.userInfo
        })
      })
  },


  userAuthorized() { // 监测用户是否已经授权过了 没有用promise 的写法
    wx.getSetting({
      success: data => {
        if (data.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: data => {
              this.setData({
                authorized: true,
                userInfo: data.userInfo
              })
            }
          })
        }
      }
    })
  },



  onGetUserInfo(event) { //用户点击按钮允许授权
    const userInfo = event.detail.userInfo
    if (userInfo) {
      this.setData({
        userInfo,
        authorized: true
      })
    }
  },

  onJumpToAbout(event) { // 跳转到关于我们的页面
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },

  onStudy(event) { // 跳转到点击学习页面
    wx.navigateTo({
      url: '/pages/course/course',
    })
  },

  onJumpToDetail(event) { // 跳转到当前期刊页
    console.log('这个功能还没有做')
    return
    const cid = event.detail.cid
    const type = event.detail.type
    // wx.navigateTo
    wx.navigateTo({
      url: `/pages/classic-detail/classic-detail?cid=${cid}&type=${type}`
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.blogId.onPullDownRefresh()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.blogId.onReachBottom()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    this.blogId.onShareAppMessage()
  }


})