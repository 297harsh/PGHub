require("dotenv").config();
const express = require('express');

const app = express();
const port = process.env.PORT || 8080

app.listen(port,(req,res)=>{
  console.log(`PGHub listening on http://127.0.0.1:${port} `);
})
