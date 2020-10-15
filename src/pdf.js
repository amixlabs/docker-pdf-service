const { setupProxyIfNeeded } = require('./util')
const debug = require('debug')('app:pdf')

module.exports = async ({ browser, options }) => {
  const { url, origin, headers, timeout } = options
  const { waitSelector, pdfOptions = {} } = options
  const context = await browser.createIncognitoBrowserContext()
  const page = await context.newPage()
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
    } else {
      req.continue()
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
  await page.goto(url, { waitUntil: 'networkidle2' })
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
