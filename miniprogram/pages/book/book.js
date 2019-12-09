
Page({

  /**
   * 页面的初始数据
   */
  data: {
    books: [],
    searching:false,
    more:''
  },

  /**
   * 生命周期函数--监听页面加
   */
  onLoad: function (optins) {// 页面加载的时候我要干点啥
    this._getBookList()
  },

  onSearching(event){// 显示搜索页面
    this.setData({
      searching:true
    })
  },

  onCancel(event){ // 搜索页面点取消的时候发送回来的事件
    this.setData({
      searching:false
    }) 
  },

  onReachBottom(){
    this.setData({
      more:random(16)
    })
  },
  _getBookList() { // 获取到所有故事的数据
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'book',
      data: {
        $url: 'bookList',
      }
    }).then((res) => {
      this.setData({
        books: res.result.data,
      })
      wx.hideLoading()
    })
  }

  

})