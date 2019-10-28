const { setupProxyIfNeeded } = require('./util')
const debug = require('debug')('app:pdf')

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports = async ({ browser, options }) => {
  const { url, origin, headers, timeout } = options
  const { waitSelector, pdfOptions = {} } = options
  const page = await browser.newPage()
  page.setRequestInterception(true)
  page.on('request', req => {
    const url = req.url()
    debug({
      url,
      method: req.method(),
      resourceType: req.resourceType()
    })
    if (url.indexOf(origin) === 0) {
      const overrides = {
        headers: {
          ...req.headers(),
          ...headers
        }
      }
      debug({ overrides })
      req.continue(overrides)
    }
  })
  page.on('response', async res => {
    debug({
      url: res.url(),
      ok: res.ok(),
      status: res.status(),
      headers: res.headers()
      // text: await res.text()
    })
  })
  await setupProxyIfNeeded(page)
  page.setDefaultNavigationTimeout(timeout)
  debug(`goto ${url}`)
  await page.goto(url, { waitUntil: 'networkidle0' })
  if (waitSelector) {
    // await page.$('body[report-end=true]')
    debug({ waitSelector })
    await page.$(waitSelector)
  }
  // await page.emulateMedia('screen')
  const buffer = await page.pdf({
    format: 'A4',
    landscape: false,
    printBackground: true,
    preferCSSPageSize: true,
    ...pdfOptions
  })
  await page.close()
  return buffer
}
