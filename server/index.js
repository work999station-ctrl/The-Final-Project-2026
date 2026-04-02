const express = require('express');
const mongoose = require('mongoose');
const app = express();
const products = require('./routes/products.routes.js');
const cookieParser = require('cookie-parser');
const allRoutes = require('./routes/all.routes.js')
const {requireAuth , checkUser} = require('./middleware/authmiddleware.js');

//middleware
app.use(express.json());
app.use(express.urlencoded({extends:false}))
app.use(express.static('public'));
app.use(cookieParser());
app.set('view engine', 'ejs');
// app.use('/api/products' ,products)
app.use(checkUser);







mongoose.connect('mongodb+srv://ghokghoki_db_user:B6beJA95BDiqwHD5@cluster0.l11irmx.mongodb.net/?appName=Cluster0')
.then(()=>{
    console.log('connected to the data base');
    app.listen(3000 , ()=>{
        console.log('server in running on port 3000');
    })
})
.catch(()=>{
    console.log('connection failed');
})


app.get('/' , (req , res)=> res.render('home'));
app.use(allRoutes);