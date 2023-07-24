const express=require('express');
const routes=express.Router()
const controller=require('../controller/student.controller');
const student_token =require('../middleware/student.middleware')

//login

routes.get('/login',controller.studentlogin);
routes.post('/logindata',controller.studentlogindata);

//OTP

routes.get('/resetpassword',controller.resetpasswordpage);
routes.post('/resetpasswordotp',controller.resetpasswordotp);
routes.post('/checkotp',controller.checkotp);
routes.post('/newpassword',controller.newpassword);


routes.get('/dashboard',student_token,controller.dashboard);
routes.get('/logout',(req,res)=>{

    res.cookie("studentjwt",'');
    res.clearCookie();
    res.redirect('/student/dashboard');
})





module.exports=routes;
