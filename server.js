const app = require('./src/app.js')
const PORT = process.env.DEV_APP_PORT || 3056

const server = app.listen(PORT, () => {
  console.log(`WS eCommerce start with port ${PORT}`)
})

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Exit Server Express')
  })
})