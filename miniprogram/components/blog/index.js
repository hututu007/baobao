/*
 * @Author: 胡海
 * @Date: 2020-01-16 21:45:34
 * @LastEditors  : 胡海
 * @LastEditTime : 2020-01-16 22:21:20
 * @Description: 
 */
// 搜索的关键字
let keyword = ''
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    // 控制底部弹出层是否显示
    modalShow: false,
    blogList: [],
  },
  attached() {
    this._loadBlogList()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onPublish() { // 发布功能
      // 判断用户是否授权
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) { //授权过了
            wx.getUserInfo({
              success: (res) => {
                this.onLoginSuccess({ // 调用用户登录成功函数，把信息传给他
                  detail: res.userInfo
                })
              }
            })
          } else { // 没有授权
            this.setData({
              modalShow: true,
            })
          }
        }
      })
    },
    onLoginSuccess(event) { // 用户登录成功函数
      const detail = event.detail
      wx.navigateTo({ // 跳转到发布编辑页
        url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
      })
    },
    onLoginFail() { // 用户拒绝授权函数
      wx.showModal({
        title: '授权用户才能发布',
        content: '',
      })
    },
    onSearch(event) { // 搜索
      // console.log(event.detail.keyword)
      this.setData({
        blogList: []
      })
      keyword = event.detail.keyword
      this._loadBlogList(0)
    },
    goComment(event) { // 详情
      wx.navigateTo({
        url: '../../pages/blog-comment/blog-comment?blogId=' + event.target.dataset.blogid,
      })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
      this.setData({
        blogList: []
      })
      this._loadBlogList(0)
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
      this._loadBlogList(this.data.blogList.length)
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage(event) {
      let blogObj = event.target.dataset.blog
      return {
        title: blogObj.content,
        path: `/pages/blog-comment/blog-comment?blogId=${blogObj._id}`,
      }
    },
    _loadBlogList(start = 0) {
      wx.showLoading({
        title: '拼命加载中',
      })
      wx.cloud.callFunction({
        name: 'blog',
        data: {
          keyword,
          start,
          count: 10,
          $url: 'list',
        }
      }).then((res) => {
        console.log(res)
        this.setData({
          blogList: this.data.blogList.concat(res.result)
        })
        wx.hideLoading()
        wx.stopPullDownRefresh()
      })
    },
  }
})