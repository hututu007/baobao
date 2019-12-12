// pages/book-detail/book-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comments: [],
    book: null,
    likeStatus: false,
    likeCount: 0,
    posting: false
  },

  /**
   * 生命周期函数--监听页面加载
   */


  onLoad: function (options) {
    // 页面加载的时候干点啥
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'book',
      data: {
        $url: 'bookDetai',
        bid: options.bid
      }
    }).then((res) => {
      this.setData({
        book: res.result.data[0],
      })
      wx.hideLoading()
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})