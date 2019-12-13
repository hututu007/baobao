import {
  HTTP
} from '../util/request.js'
class ClassModel extends HTTP {
  getClassLast() {
    return this.request({// 最新一期
      cloudFn: 'class',
      data: {
        $url: 'class/last',
      }
    })
  }
  getClassRightOrLeft({index,url}) {//右键期或左键期
    return this.request({
      cloudFn: 'class',
      data: {
        $url: `class/${url}`,
        index
      }
    })
  }

}

export {
  ClassModel
}