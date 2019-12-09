// 1. 根据css 实现动画
// 2. 保证后台播放，且切换组件 播放状态精选关联 getBackgroundAudioManager调用微信api 可以实现

import {
  classicBeh
} from '../classic-beh.js'

const mMgr = wx.getBackgroundAudioManager()

Component({
  /**
   * 组件的属性列, 动画
   * 动画API CSS3 canvas 游戏
   * 现成
   */
  behaviors: [classicBeh],// 类似于vue 的混入
  properties: {
    src: String,// 音乐播放地址
    title:String// 控制背景播放上的title
  },

  /**
   * 组件的初始数据
   * 播放音乐API 老版API 新版API
   */
  data: {
    playing: false,// 控制图标的状态
    pauseSrc: 'images/player@pause.png',
    playSrc: 'images/player@play.png',
  },

  attached(event) {// 在组件实例进入页面节点树时执行
    // 跳转页面 当前 切换
    this._recoverStatus()
    this._monitorSwitch()
  },

  detached: function (event) {// 在组件实例被从页面节点树移除时执行
    
  },

  /**
   * 组件的方法列表 
   */
  methods: {
    onPlay: function (event) {// 点击按钮图片播放音乐事件
      // 图片要切换
      if (!this.data.playing) {
        this.setData({
          playing: true
        })
        mMgr.src = this.properties.src
        mMgr.title = this.properties.title
      } else {
        this.setData({
          playing: false
        })
        mMgr.pause()
      }
    },

    _recoverStatus: function () {// 判断是否有音乐在播放
      if (mMgr.paused) {// 没有音乐播放
        this.setData({
          playing: false
        })
        return
      }
      if (mMgr.src == this.properties.src) {// 有音乐播放，且地址和当前组件一样
        this.setData({
          playing: true
        })
      }
    },

    _monitorSwitch: function () {// 背景面板的监听
      mMgr.onPlay(() => {
        this._recoverStatus()
      })
      mMgr.onPause(() => {
        this._recoverStatus()
      })
      mMgr.onStop(() => {
        this._recoverStatus()
      })
      mMgr.onEnded(() => {
        this._recoverStatus()
      })
    }




  }
})