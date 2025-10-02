const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const errorHandlerMiddleware = require('./middleware/errorHandler')
const notfoundMiddleware = require('./middleware/notFound')

app.use(cors())
const port = process.env.PORT || 8020

app.use(express.json())

app.post('/api/v1/shorten', (req, res) => {
  const {originalURL} = req.body
  console.log(originalURL)
  res.send('API has been shortened')
})

app.get('/api/v1/tinyurl/:tinyurl', (req, res) => {
  const tinyURL = req.params.tinyurl
  console.log(tinyURL)
  res.send('Shortcode is processed...')
})

app.use(notfoundMiddleware)
app.use(errorHandlerMiddleware)

const start = () => {
  app.listen(port, () => console.log(`Server is listening on port ${port}...` ))
}

start()