require("dotenv").config();
const express = require('express')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express()
const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useFindAndModify:false
},(err) => {
  if(err){
    console.error(err)
  } else {
    console.log("connected to db")
  }
})
const moviesRoute = require("./routes/movies.route");
const usersRoute = require("./routes/users.route");
const tokenRoute = require("./routes/token.route");
const boxMovieRoute = require("./routes/boxMovie.route");
const renderRoute = require("./routes/index.route");
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(process.env.SESSION_SECRET));

app.use(express.static(path.join(__dirname, 'build')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers","*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});
app.use("/api/movies/box",boxMovieRoute);
app.use('/api/movies', moviesRoute);
app.use('/api/users', usersRoute);
app.use('/api/', tokenRoute);
app.use("/",renderRoute);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))