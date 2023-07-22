const express=require('express');
const routes=express.Router()
const controller=require('../controller/admincontroller');
const upload=require('../cloud/multer');
const admin_token =require('../middleware/admin.middleware')


// routes.get('/register',controller.registerpage);
routes.post('/registerdata',controller.registerdata)
routes.get('/login',controller.loginpage);
routes.post('/logindata',controller.logindata);
routes.get('/dashboard',admin_token,controller.dashboard);
routes.get('/delete/:id',admin_token,controller.deletes);
routes.get('/update/:id',admin_token,controller.updatepage);
routes.post('/update/:id',admin_token,upload.single('img'),controller.updates);
routes.get('/profile',admin_token,controller.profiles)
routes.get('/logout',(req,res)=>{

    res.cookie("jwt",'');
    res.clearCookie();
    res.redirect('/admin/dashboard');
})



module.exports=routes;