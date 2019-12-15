/*
 * @Author: 胡海
 * @Date: 2019-12-11 23:01:49
 * @LastEditors: 胡海
 * @LastEditTime: 2019-12-15 00:21:03
 * @Description: 
 */
import {
  HTTP
} from '../util/request.js'
class ClassModel extends HTTP {
  getClassLast() {
    return this.request({ // 最新一期
      cloudFn: 'class',
      data: {
        $url: 'class/last',
      }
    })
  }
  getClassRightOrLeft({
    index,
    url
  }) { //右键期或左键期
    return this.request({
      cloudFn: 'class',
      data: {
        $url: `class/${url}`,
        index
      }
    })
  }
  Like({
    url,
    uid
  }) { //点赞
    return this.request({
      cloudFn: 'class',
      data: {
        $url: url,
        uid
      }
    })
  }
  getLike({
    uid
  }) { //获取点赞数和点赞状态
    return this.request({
      cloudFn: 'class',
      data: {
        $url: 'getLike',
        uid
      }
    })
  }
  getLikeList() { //获取喜欢的期刊
    return this.request({
      cloudFn: 'class',
      data: {
        $url: 'likeList',
      }
    })
  }

isMIniIndex(index) { // 是否是最小的小的一期
  return index == 1 ? true : false
}
isMaxIndex(index) { // 是否是最大的一期
  let MaxIndex = this.getLatestIndex()
  return index == MaxIndex ? true : false
}
setLatestIndex(index) { //将最新一期的index 存到storing缓存里面
  wx.setStorageSync('latest', index)
}
getLatestIndex() { //将最新一期的index 从缓存里面取出来
  const index = wx.getStorageSync('latest')
  return index
}
getKey(index) {// 设置在缓存中期刊的名字
  const key = 'classic-' + index
  return key
}

}

export {
  ClassModel
}