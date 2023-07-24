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
routes.post('/newpassword',controller.newpassword);


// OTP END
routes.get('/dashboard',manager_token,controller.dashboard);
routes.get('/studentdataform',controller.studentdataform);
routes.post('/studentdata',manager_token,upload.single('img'),controller.studentdatapost);
routes.get('/profiles',manager_token,controller.profiles);
routes.get('/delete/:id',manager_token,controller.deletes);
routes.get('/updatepage/:id',controller.updatepage);
routes.post('/updatepage/:id',manager_token,upload.single('img'),controller.updates);
routes.get('/studentdetails/:id',manager_token,controller.studentdetails);
routes.post('/studentfees/:id',manager_token,controller.studentfees)

routes.get('/logout',(req,res)=>{

    res.cookie("managerjwt",'');
    res.clearCookie();
    res.redirect('/manager/dashboard');
})





module.exports=routes;
