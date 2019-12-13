class HTTP {
  request({
    cloudFn,
    data = {}
  }) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
          name: cloudFn,
          data
        })
        .then((res) => {
          resolve(res)
        })
        .catch((res) => {
          reject(res)
        })
    })
  }
}
export {
  HTTP
}