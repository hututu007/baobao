// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  app.router('bookList', async (ctx, next) => {
    if (event.title) {
      ctx.body = await cloud.database().collection('book')
        .where({
          title: event.title
        })
        .get()
        .then((res) => {
          return res
        })
    } else {
      ctx.body = await cloud.database().collection('book')
        .orderBy('index', 'desc')
        .get()
        .then((res) => {
          return res
        })
    }

  })
  app.router('bookDetai', async (ctx, next) => {
    ctx.body = await cloud.database().collection('bookDetai')
      .where({
        bid: event.bid
      })
      .get()
      .then((res) => {
        return res
      })
  })

  return app.serve()
}