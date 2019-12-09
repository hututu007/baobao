// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const rq = require('request-promise')
const db = cloud.database()
const URL = 'http://musicapi.xiecheng.live/personalized'
const playlistCollection = db.collection('playlist')

const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async(event, context) => {
  const {
    total
  } = await playlistCollection.count()
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    let promise = await playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  let list = {
    data:[]
  }
  if(tasks.length>0){
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return{
        data:acc.data.concat(acc.data)
      }
    })
  }

  let playlist = await rq(URL).then((res) => {
    return JSON.parse(res).result
  })
  const newData = []
  for (let i = 0, len1 = playlist.length; i < len1; i++) {
    let flag = true
    for (let j = 0, len2 = list.data.length; j < len2; j++) {
      if (playlist[i].id === list.data[i].id) {
        flag = false
        break
      }
    }
    if (flag) {
      newData.push(playlist[i])
    }
  }
  for (let i = 0, len = newData.length; i < len; i++) {
    await playlistCollection.add({
        data: {
          ...newData[i],
          createTime: db.serverDate()
        }
      })
      .then((res) => {
        console.log('插入成功')
      })
      .catch((err) => {
        console.error('插入失败')
      })
  }
  return newData.length

}