class HTTP {
  request({
    cloudFn,
    url
  }) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
          name: cloudFn,
          data: {
            $url: url
          }
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