// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')

cloud.init()


// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  app.router('class/last', async (ctx, next) => { //最新
    ctx.body = await cloud.database().collection('class')
      .orderBy('index', 'desc')
      .skip(0).limit(1)
      .get()
      .then((res) => {
        return res
      })
  })
  app.router('class/Right', async (ctx, next) => { // 右键
    ctx.body = await cloud.database().collection('class')
      .where({
        index: event.index - 1
      })
      .get()
      .then((res) => {
        return res
      })
  })
  app.router('class/Left', async (ctx, next) => { // 左键
    ctx.body = await cloud.database().collection('class')
      .where({
        index: event.index + 1
      })
      .get()
      .then((res) => {
        return res
      })
  })

  const wxContext = cloud.getWXContext()
  app.router('like', async (ctx, next) => { // 点赞
    let like = await cloud.database().collection('likeStatus')
      .where({
        _openid: wxContext.OPENID,
        uid: event.uid
      })
      .get()
      .then((res) => {
        return res
      })
    if (like.data.length != 0) {
      ctx.body = {
        code: 0,
        msg: '你已经点赞过了'
      }
      return
    }
    await cloud.database().collection('class')
      .where({
        _id: event.uid
      })
      .update({
        data: {
          like_nums: cloud.database().command.inc(1),
        }
      })
    await cloud.database().collection('likeStatus')
      .add({
        data: {
          _openid: wxContext.OPENID,
          status: 1,
          uid: event.uid
        }
      })
      .then((res) => {
        ctx.body = {
          code: 0,
          msg: '点赞成功'
        }
        return
      })
  })
  app.router('cancel', async (ctx, next) => { // 取消点赞
    let like = await cloud.database().collection('likeStatus')
      .where({
        _openid: wxContext.OPENID,
        uid: event.uid
      })
      .get()
      .then((res) => {
        return res
      })
    if (like.data.length == 0) {
      ctx.body = {
        code: 0,
        msg: '你还没有点赞过'
      }
      return
    }
    await cloud.database().collection('class')
      .where({
        _id: event.uid
      })
      .update({
        data: {
          like_nums: cloud.database().command.inc(-1),
        }
      })
    await cloud.database().collection('likeStatus')
      .where({
        _openid: wxContext.OPENID,
        uid: event.uid
      })
      .remove()
      .then((res) => {
        ctx.body = {
          code: 0,
          msg: '取消点赞成功'
        }
        return
      })
  })
  app.router('getLike', async (ctx, next) => { // 获取点赞状态
    let likeStatus = await cloud.database().collection('likeStatus')
      .where({
        _openid: wxContext.OPENID,
        uid: event.uid
      })
      .get()
      .then((res) => {
        return res
      })
    let likeNum = await cloud.database().collection('class')
      .where({
        _id: event.uid
      })
      .get()
      .then(res => {
        return res
      })
    let status = 1
    if (likeStatus.data.length == 0) {
      status = 0
    }
    ctx.body = {
      code: 0,
      status,
      like_nums: likeNum.data[0].like_nums
    }
  })



  app.router('likeList', async (ctx, next) => { // 获取收藏的期刊列表
    let likeAll = await cloud.database().collection('likeStatus')
      .where({
        _openid: wxContext.OPENID,
      })
      .get()
      .then((res) => {
        return res.data.map(item => item.uid)
      })
    if (likeAll.length == 0) {
      ctx.body = {
        code: 0,
        msg: '你一个喜欢的期刊都没有'
      }
      return
    }
    let likeNum = await cloud.database().collection('class')
      .where({
        _id: cloud.database().command.in(likeAll),
      })
      .get()
      .then(res => {
        return res
      })
    ctx.body = {
      code: 0,
      data: likeNum
    }
  })
  app.router('getBlog', async (ctx, next) => { // 获取blog
    let blogShow = await cloud.database().collection('blogShow')
      .get()
      .then((res) => {
        return res
      })
    ctx.body = {
      code: 0,
      data: blogShow
    }
  })
  return app.serve()
}