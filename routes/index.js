const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');

// Show homepage
router.get('/', (req, res) => {
  res.render('index');
});

// Show register form
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle register form
router.post('/register', async (req, res) => {
  const { name, email, password, mobile } = req.body;
  await User.create({ name, email, password, mobile });
  res.redirect('/login');
});

// Show login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.send('Login failed');
  req.session.user = user;
  res.redirect('/dashboard');
});

// Dashboard
router.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('dashboard', { user: req.session.user });
});

module.exports = router;
// Explore events
router.get('/events/explore', async (req, res) => {
  const events = await Event.find();
  res.render('explore', { events, user: req.session.user });
});

// Register for event
router.post('/events/register/:id', async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event.registeredUsers.includes(req.body.email)) {
    event.registeredUsers.push(req.body.email);
    await event.save();
  }
  res.redirect('/events/registered');
});

// View registered events
router.get('/events/registered', async (req, res) => {
  const email = req.session.user.email;
  const events = await Event.find({ registeredUsers: email });
  res.render('registered', { events });
});

// View & Add hosted events
router.get('/events/myevents', async (req, res) => {
  const email = req.session.user.email;
  const events = await Event.find({ hostedBy: email });
  res.render('myevents', { events, user: req.session.user });
});

router.post('/events/host', async (req, res) => {
  const { title, type, date, location, hostedBy } = req.body;
  await Event.create({ title, type, date, location, hostedBy });
  res.redirect('/events/myevents');
});
