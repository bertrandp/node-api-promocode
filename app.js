'use strict';

/** require dependencies */
const express = require('express');
const routes = require('./src/routes/');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const router = express.Router();

const port = process.env.PORT || 5000;

/** set up routes {API Endpoints} */
routes(router);

/** set up middlewares */
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('combined'));

app.use('/api', router);

/** start server */
app.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});

module.exports = app;
