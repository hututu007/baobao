// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')

cloud.init()


// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  app.router('classList', async (ctx, next) => {
    ctx.body = await cloud.database().collection('class')
      .orderBy('index', 'desc')
      .get()
      .then((res) => {
        return res
      })
  })
  app.router('class/last', async (ctx, next) => {
    ctx.body = await cloud.database().collection('class')
      .orderBy('index', 'desc')
      .skip(0).limit(1)
      .get()
      .then((res) => {
        return res
      })
  })
  const wxContext = cloud.getWXContext()
  app.router('likeCount', async (ctx, next) => { // 获取期刊的点赞总数
    ctx.body = await cloud.database().collection('likeStatus')
      .where({
        appId: event.appId
      })
      .get()
      .then((res) => {
        return res
      })
  })
  app.router('likeStatus', async (ctx, next) => { // 获取点赞状态
    ctx.body = await cloud.database().collection('likeStatus')
      .where({
        _openid: wxContext.OPENID
      })
      .get()
      .then((res) => {
        return res
      })
  })
  app.router('likeEdit', async (ctx, next) => { // 编辑期刊点赞总数
    // 进来先查这个用户是否点赞过
    let user = await cloud.database().collection('likeStatus')
      .where({
        _openid: wxContext.OPENID
      })
      .get()
    if (user.data.length != 0) {
      ctx.body = await cloud.database().collection('likeStatus')
        .where({
          _openid: wxContext.OPENID
        })
        .update({
          data: {
            status: event.status,
          }
        })
        .then((res) => {
          return res
          console.log('插入成功')
        })
        .catch((err) => {
          console.error('插入失败')
        })
    } else {
      ctx.body = await cloud.database().collection('likeStatus')
        .add({
          data: {
            _openid: wxContext.OPENID,
            status: event.status,
          }
        })
        .then((res) => {
          return res
          console.log('插入成功')
        })
        .catch((err) => {
          console.error('插入失败')
        })
    }

  })
  return app.serve()
}