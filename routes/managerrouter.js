const express=require('express');
const routes=express.Router()
const controller=require('../controller/manager.controller');
const upload=require('../cloud/multer');
const manager_token =require('../middleware/manager.middleware')



routes.get('/login',controller.loginpage);
routes.post('/logindata',controller.logindata);

//OTP

routes.get('/resetpassword',controller.resetpasswordpage);
routes.post('/resetpasswordotp',controller.resetpasswordotp);
routes.post('/checkotp',controller.checkotp);
routes.post('/newpassword',controller.newpassword)
// OTP END
routes.get('/dashboard',manager_token,controller.dashboard);
routes.get('/studentdataform',controller.studentdataform);
routes.post('/studentdata',upload.single('img'),controller.studentdatapost)

routes.get('/logout',(req,res)=>{

    res.cookie("jwt",'');
    res.clearCookie();
    res.redirect('/manager/dashboard');
})





module.exports=routes;
