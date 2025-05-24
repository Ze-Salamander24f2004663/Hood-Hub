const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

// Routes
const routes = require('./routes/index');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Session
app.use(session({
  secret: 'communitypulse_secret',
  resave: false,
  saveUninitialized: false
}));

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected")).catch(err => console.log(err));

// Use Routes
app.use('/', routes);

// Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
