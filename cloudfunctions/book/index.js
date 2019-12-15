/*
 * @Author: 胡海
 * @Date: 2019-12-09 21:23:31
 * @LastEditors: 胡海
 * @LastEditTime: 2019-12-14 22:40:07
 * @Description: 
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

const TcbRouter = require('tcb-router')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  app.router('bookList', async (ctx, next) => {// 书籍的搜索
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
  app.router('bookDetai', async (ctx, next) => {// 书籍的详情搜索
    ctx.body = await cloud.database().collection('bookDetai')
      .where({
        bid: event.bid
      })
      .get()
      .then((res) => {
        return res
      })
  })
  app.router('hotList', async (ctx, next) => {// 热词搜索
    ctx.body = await cloud.database().collection('hotList')
      .get()
      .then((res) => {
        return res
      })
  })

  return app.serve()
}