require("dotenv").config();
const express = require('express')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express()
const port = 5000;
mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useFindAndModify:false,
})
// const moviesRoute = require("./routes/movies.route");
const usersRoute = require("./routes/users.route");
const tokenRoute = require("./routes/token.route");
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(process.env.SESSION_SECRET));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers","*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// app.use('/api/movies', moviesRoute);
app.use('/api/users', usersRoute);
app.use('/api/', tokenRoute);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))