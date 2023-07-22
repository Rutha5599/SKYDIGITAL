const express=require('express');
const routes=express.Router()
const controller=require('../controller/manager.controller');
const upload=require('../cloud/multer');
const manager_token =require('../middleware/manager.middleware')


routes.post('/registerdata',controller.registerdata)
routes.get('/login',controller.loginpage);
routes.post('/logindata',controller.logindata);

//OTP

routes.get('/resetpassword',controller.resetpasswordpage);
routes.post('/resetpasswordotp',controller.resetpasswordotp);
routes.post('/checkotp',controller.checkotp);
routes.post('/newpassword',controller.newpassword)

routes.get('/dashboard',manager_token,controller.dashboard);
routes.get('/delete/:id',manager_token,controller.deletes);
routes.get('/update/:id',manager_token,controller.updatepage);
routes.post('/update/:id',manager_token,upload.single('img'),controller.updates);
routes.get('/profile',manager_token,controller.profiles)
routes.get('/logout',(req,res)=>{

    res.cookie("jwt",'');
    res.clearCookie();
    res.redirect('/admin/dashboard');
})





module.exports=routes;
