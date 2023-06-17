

const express = require('express');
const jwt = require('jsonwebtoken');
// const serverless =require('serverless-http');
const userRouter = require("./src/api/users/user.router.js");
require('./src/config/database.js')
const app = express();
const port = 3000;

app.use(express.json());
// app.use('/attachments', express.static('/attachments'));
const path = require('path')
app.use('/tmp', express.static(path.join(__dirname, 'tmp')))
app.use(userRouter);

// Start the server
app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port ${port}`);
});

// module.exports.handler = serverless(app);


