const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const express = require('express')
const morgan = require('morgan')
const program = require('commander')
const knex = require('knex')
const { Model } = require('objection');

const knexfile = require('./knexfile');
const sessionRouter = require('./routes/session');
const userRouter = require('./routes/users');

function main (opts) {
  // Initialize app
  let app = express()

  /* --------- BEGIN Middlewares --------- */
  // Logging
  app.use(morgan('dev'))

  // Cookies
  app.use(cookieParser())

  // Cross Origin Resource Sharing
  app.use(cors({credentials: true, origin: true}))

  // Configure static directory
  const staticDir = path.join(__dirname, '..', 'public')
  app.use(express.static(staticDir))

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }))

  // parse application/json
  app.use(bodyParser.json())

  // routes
  app.use('/session', sessionRouter);
  app.use('/users', userRouter);
  app.use('*', function (req, res) {
    res.sendFile('index.html')
  });

  /* --------- END Middlewares --------- */

  // Set up db
  const db = knex(knexfile)
  Model.knex(db);

  // Create HTTP server
  let port = process.env.PORT || 8000
  app.listen(port)
  console.log(`Express listening on port ${port}`)
}

if (require.main === module) {
  program
  .description('Info: Start the backend webserver')
  .usage(': babel-node --harmony server.py [options]')
  .parse(process.argv)

  main(program)
}
