const fs = require('fs')
const path = require('path')
const { URL } = require('url')

class ErrorCode extends Error {
  constructor (message, code) {
    super(`${code}: ${message}`)
  }
}

class Deferred {
  constructor (timeout = 15000) {
    this.promise = new Promise((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
    this.timer = setTimeout(() => {
      this._reject(new Error('[deferred] Promise rejected by timeout'))
    }, timeout)
  }

  resolve (...args) {
    this.unref()
    return this._resolve(...args)
  }

  reject (...args) {
    this.unref()
    return this._reject(...args)
  }

  unref () {
    clearTimeout(this.timer)
    this.timer = null
  }
}

function setupProxyIfNeeded (page) {
  const urlProxy = process.env.HTTPS_PROXY || process.env.https_proxy
  if (!urlProxy) {
    return page
  }
  const { username, password } = new URL(urlProxy)
  if (username && password) {
    return page.authenticate({ username, password })
  }
  return page
}

function checkFileExists (filePath, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filePath)
    const basename = path.basename(filePath)
    const watcher = fs.watch(dir, (eventType, filename) => {
      if (eventType === 'rename' && filename === basename) {
        clearTimeout(timer)
        watcher.close()
        resolve()
      }
    })
    const timer = setTimeout(() => {
      watcher.close()
      reject(
        new Error(
          '[checkFileExists] File does not exist, and was not created during the timeout delay.'
        )
      )
    }, timeout)
    fs.access(filePath, fs.constants.R_OK, err => {
      if (!err) {
        clearTimeout(timer)
        watcher.close()
        resolve()
      }
    })
  })
}

module.exports = {
  ErrorCode,
  Deferred,
  setupProxyIfNeeded,
  checkFileExists
}
