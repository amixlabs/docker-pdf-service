const puppeteer = require('puppeteer')
const debug = require('debug')('app:browser')

async function createBrowser () {
  debug('browser launching...')
  const options = {
    ignoreHTTPSErrors: true,
    headless: true,
    args: ['--no-sandbox', '--lang=pt-BR,pt']
  }
  if (process.env.CHROMIUM_BROWSER) {
    options.executablePath = process.env.CHROMIUM_BROWSER
  }
  const browser = await puppeteer.launch(options)
  debug('browser launched')
  return browser
}

module.exports = createBrowser
