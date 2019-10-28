require('dotenv').config()

const path = require('path')
const express = require('express')
const debug = require('debug')('app:express')
const createBrowser = require('./browser')
const createPDF = require('./pdf')
const { ErrorCode } = require('./util')

module.exports = async config => {
  const timeout = config.TIMEOUT || 15000
  const PORT = config.PORT || 3000

  const browser = await createBrowser()

  const app = express()
  app.use(express.static(path.join(__dirname, 'public')))
  app.get('/pdf', async function (req, res) {
    try {
      const {
        url,
        'x-pdf-options': xPdfOptions,
        'x-wait-selector': waitSelector,
        ...headers
      } = req.query
      if (!url) {
        throw new ErrorCode('Invalid querystring', 400)
      }
      const origin = new URL(url).origin
      let pdfOptions
      try {
        pdfOptions = xPdfOptions
          ? JSON.parse(xPdfOptions)
          : {}
      } catch (err) {
        debug(err)
        throw new ErrorCode('Invalid JSON in x-pdf-options header', 400)
      }
      debug({
        url,
        origin,
        pdfOptions,
        waitSelector,
        headers,
        timeout
      })
      const buffer = await createPDF({
        browser,
        options: {
          url,
          origin,
          pdfOptions,
          waitSelector,
          headers,
          timeout
        }
      })
      res.type('pdf')
      res.send(buffer)
    } catch (err) {
      debug(err)
      res.status(err.status || 500).send(err.message)
    }
  })
  const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })

  let stopped = false
  return () => {
    if (stopped) return
    stopped = true
    console.log('Stops the server from accepting new connections')
    server.close()
    console.log('Close browser')
    browser.close()
  }
}
