const server = require('./index')
const debug = require('debug')('app:server')

process.on('unhandledRejection', reason => debug(reason))
process.on('rejectionHandled', reason => debug(reason))

server(process.env)
  .then(shutdown => {
    process.once('SIGTERM', shutdown)
    process.once('SIGINT', shutdown)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
