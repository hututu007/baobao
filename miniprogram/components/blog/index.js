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
  }
})