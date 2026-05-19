const jwt = require('jsonwebtoken');
const student = require('../models/Student.model');
const Company = require('../models/Company.model');
const Admin = require('../models/Admin.model');

const requireAuth = (req , res , next) =>{
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token , 'net ninja secret' ,async (err , decodedToken) =>{
            if(err){
                console.log( 'Auth Error: ' + err.message);
                return res.redirect('/login');
            }
            try {
                let user = await student.findById(decodedToken.id);
                if (user) {
                    req.user = user;
                    req.userType = 'student';
                } else {
                    user = await Company.findById(decodedToken.id);
                    if (user) {
                        req.user = user;
                        req.userType = 'company';
                    } else {
                        user = await Admin.findById(decodedToken.id);
                        if (user) {
                            req.user = user;
                            req.userType = 'admin';
                        }
                    }
                }
                next();
            } catch (dbErr) {
                console.error('Database error in auth middleware:', dbErr);
                res.status(500).json({ error: 'Internal server error during authentication', details: dbErr.message });
            }
        });
    }
    else{
        res.redirect('/login');
    }
}

const requireAuthAPI = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
            if (err) {
                console.log('Auth Error:', err.message);
                return res.status(401).json({ error: 'Unauthorized' });
            }
            try {
                let user = await student.findById(decodedToken.id);
                if (user) {
                    req.user = user;
                    req.userType = 'student';
                } else {
                    user = await Company.findById(decodedToken.id);
                    if (user) {
                        req.user = user;
                        req.userType = 'company';
                    } else {
                        user = await Admin.findById(decodedToken.id);
                        if (user) {
                            req.user = user;
                            req.userType = 'admin';
                        }
                    }
                }
                next();
            } catch (dbErr) {
                console.error('Database error in auth middleware:', dbErr);
                res.status(500).json({ error: 'Internal server error during authentication', details: dbErr.message });
            }
        });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

//check current user

const checkUser = (req , res , next)=>{
    const token = req.cookies.jwt

    if(token){
     jwt.verify(token , 'net ninja secret' , async (err , decodedToken) =>{
            if(err){
                console.log('ad' + err.message);
                res.locals.user = null ;
                next();
            }else{
                // console.log(decodedToken);
                let user = await student.findById(decodedToken.id);
                if (!user) {
                    user = await Company.findById(decodedToken.id);
                }
                if (!user) {
                    user = await Admin.findById(decodedToken.id);
                }
                res.locals.user = user;
                next();
                
            }
        })
    }else{
     res.locals.user = null ;
     next();
    }


}

module.exports = {requireAuth , checkUser, requireAuthAPI};