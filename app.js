const express = require('express');
const jwt = require('jsonwebtoken');
const userRouter = require("./src/api/users/user.router.js");
const path = require('path')
require('./src/config/database.js')


const app = express();
const port = 3000;

app.use(express.json());
app.use('/attachments', express.static(path.join(__dirname, 'attachments')))
app.use(userRouter);

// Start the server
app.listen(process.env.PORT , () => {
  console.log(`Server is running on port ${port}`);
});



