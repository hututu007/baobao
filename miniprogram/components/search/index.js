// components/search/index.js
import {
  paginationBev
} from '../behaviors/pagination.js'
import {
  KeywordModel
} from '../../models/keyword.js'
const keywordModel = new KeywordModel()

Component({
  /**
   * 组件的属性列表
   */
  behaviors: [paginationBev],
  properties: {
    more: {
      type: String,
      observer: 'loadMore'
      // true, true, true,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    historyWords: [],
    hotWords: [],
    searching: false,
    q: '',
    loading: false,
    loadingCenter: false
  },

  attached() {
    this.setData({
      historyWords: keywordModel.getHistory()
    })

    // keywordModel.getHot().then(res => {
    //   this.setData({
    //     hotWords: res.hot
    //   })
    // })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadMore() {
      if (!this.data.q) {
        return
      }
      if (this.isLocked()) {
        return
      }
      if (this.hasMore()) {
        this.locked()
        bookModel.search(this.getCurrentStart(), this.data.q)
          .then(res => {
            this.setMoreData(res.books)
            this.unLocked()
          }, () => {
            this.unLocked()
          })
        // 死锁
      }
    },


    onCancel(event) { // 点击取消的事件
      this.initialize()
      this.triggerEvent('cancel', {}, {})
    },

    onDelete(event) { // 点击× 的事件  在真机可测
      this.initialize()
      this._closeResult()
    },

    onConfirm(event) { // 搜索书籍事件
      this._showResult()
      this._showLoadingCenter()
      // this.initialize() 
      const q = event.detail.value || event.detail.text
      this.setData({
        q
      })
      wx.cloud.callFunction({
        name: 'book',
        data: {
          title: q,
          $url: 'bookList',
        }
      }).then((res) => {
        this.setMoreData(res.result.data)
        this._hideLoadingCenter()
        keywordModel.addToHistory(q)
      })
      // bookModel.search(0, q)
      //   .then(res => {
      //     this.setMoreData(res.books)
      //     this.setTotal(res.total)
      //     keywordModel.addToHistory(q)
      //     this._hideLoadingCenter()
      //   })
    },

    _showLoadingCenter() {
      this.setData({
        loadingCenter: true
      })
    },

    _hideLoadingCenter() {
      this.setData({
        loadingCenter: false
      })
    },

    _showResult() {
      this.setData({
        searching: true
      })
    },

    _closeResult() {
      this.setData({
        searching: false,
        q: ''
      })
    }

    // onReachBottom(){
    //   console.log(123123)
    // }

    // scroll-view | Page onReachBottom

  }
})