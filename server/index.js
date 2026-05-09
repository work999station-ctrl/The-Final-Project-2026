
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');
const allRoutes = require('./routes/all.routes.js')
const { requireAuth, checkUser } = require('./middleware/authmiddleware.js');
const socketManager = require('./socket');
require("dotenv").config();
const path = require('path');
//middleware
app.use(express.json());
app.use(express.urlencoded({ extends: false }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
// app.set('view engine', 'ejs');
app.use(checkUser);



// Bypass Windows/ISP DNS issues with MongoDB Atlas SRV/TXT lookups
require('dns').setServers(['8.8.8.8', '8.8.4.4']);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected"))
  .catch(err => console.log(err));




app.get('/', (req, res) => res.json({ message: "Server is running", status: "API only" }));
app.use(allRoutes);

app.get('/api/test-password-reset', async (req, res) => {
  const Company = require('./models/Company.model');
  const company = await Company.findOne();
  if (company) {
    company.password = 'password123';
    await company.save();
    return res.json({ name: company.companyName, email: company.email, newPass: 'password123' });
  }
  res.json({ error: 'No companies exist' });
});

const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(app);

// Initialise Socket.IO — must happen before listen
socketManager.init(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
