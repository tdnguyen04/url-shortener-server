const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const errorHandlerMiddleware = require('./middleware/errorHandler')
const notfoundMiddleware = require('./middleware/notFound')
const pool = require('./db/main')
const CustomError = require('./errors/CustomError')

app.use(cors())
const port = process.env.PORT || 8020

app.use(express.json())

app.post('/api/v1/shorten', async (req, res) => {
  const { originalURL, tinyURL } = req.body
  
  if (originalURL && tinyURL) {
    const queryText = `
      INSERT INTO urls(original_url, tiny_url)
      VALUES ($1, $2)
    `
    try {
      const client = await pool.connect()
      const dbRes = await client.query(queryText, [originalURL, tinyURL])
      client.release()
      res.status(200).json({
        success: true,
        msg: 'Tiny url has been created'
      })
    } catch (error) {
      if (error.code === '23505') {
        throw new CustomError('PostgreSQL: URLs are not unique', 400)
      }
      throw new CustomError(error.message, 500)
    }
  }
})

app.get('/api/v1/tinyurl/:tinyurl', async (req, res) => {
  const tinyURL = req.params.tinyurl

  // query database and return the corresponding originalURL
  let client;
  try {
    client = await pool.connect()
    const queryText = `
      SELECT original_url
      FROM urls
      WHERE tiny_url = $1;
    `;
    const dbRes = await client.query(queryText, [tinyURL])
    client.release()
    if (dbRes.rows.length === 0) {
      throw new CustomError(`PostgreSQL: data not found`, 404)
    }
    return res.status(200).json({
      success: 'true',
      data: {
        originalURL: dbRes.rows[0].original_url
      }
    })
  } catch (error) {
    throw new CustomError(error, 500)
  } 
})

app.use(notfoundMiddleware)
app.use(errorHandlerMiddleware)

const start = () => {
  app.listen(port, () => console.log(`Server is listening on port ${port}...`))
}

start()