const express = require('express');
const student = require('../model/studentmodel');
const studentjwt = require('jsonwebtoken');
const cloudinary = require('../cloud/cloudinary');
const nodemailer = require('nodemailer');

// student login page


module.exports.studentlogin = async(req,res)=>{
    try {
        res.render('student-login');
    } catch (err) {
        console.log(err);        
    }
}


// student login data


module.exports.studentlogindata = async(req,res)=>{

    console.log(req.body,"oo");
    var email = req.body.email
    var password = req.body.studentpassword

    var data = await student.findOne({studentemailid:email});
    console.log(data);
    if (data == null) {
        console.log("please register or enter valid email");
        req.flash('success', 'Please Register Valid Email');
        res.redirect('back')

    }
    else {
        console.log(data);
        if (data.studentpassword == password) {
            req.flash('success', 'Loging Successfully');

            console.log(data,"uuuu");
            var token= await studentjwt.sign({id:data.id},process.env.key);
            res.cookie('studentjwt', token,{expires:new Date(Date.now()+24*60*60*1000)})
            res.redirect('/student/dashboard');
            console.log("login successfully");
        }
        else {
            console.log(req.body,"hhshhshsdhfsf");
            req.flash('success', 'Enter Valid Password')
            res.redirect('back');
            console.log("enter valid password");
        }
    }


}


// OTP

// resetpassword page

module.exports.resetpasswordpage = async(req,res)=>{
    try {
        res.render('student-reset-password');
    } catch (err) {
        console.log(err);
        
    }
}

// reset password otp


module.exports.resetpasswordotp = async(req,res)=>{
    try {
        console.log(req.body);
        var emaildata = await student.findOne({studentemailid:req.body.studentemailid})
        console.log(emaildata,"huhihh");
        if(emaildata == null){
            req.flash('success', 'Email Not Found');
            console.log("email not found");
        }
        else{
            const transport = nodemailer.createTransport({
               
                service:"gmail",
                auth:{
                    user:"jayaaradhenterprise.info@gmail.com",
                    pass:"qwbffhhrhsyvxkqb"
                }

            });

            var otp = Math.round(Math.random()*9*8*9*8*9*8);

            var info = transport.sendMail({
                from:"jayaaradhenterprise.info@gmail.com",
                to:emaildata.studentemailid,
                subject:`Forgeting Otp`,
                html:`<div
                class="container"
                style="max-width: 90%; margin: auto; padding-top: 20px"
              >
                <h2>Welcome to the SKY DIGITAL</h2>
                <h4>You are officially In ✔</h4>
                <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
                <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${otp}</h1>
           </div>`

            });
            if(info){
                console.log("Send OTP successfully");
                req.flash('success', 'Send OTP successfully');

                res.cookie("otp",[otp,emaildata.studentemailid]);
                res.render('student-check-otp')
            }
            else{
                console.log("not Send OTP");
                req.flash('success', 'not Send OTP');
            }
        }


    } catch (err) {
        console.log(err);
    }
}

//check otp

module.exports.checkotp = async(req,res)=>{
    try {
        console.log(req.body,req.cookies);

    if(req.body.otp == req.cookies.otp[0]){
        res.render('student-newpassword');
    }
    } catch (err) {
        console.log(err);
    }

}

//new password

module.exports.newpassword = async(req,res)=>{

    try {
        console.log(req.body);
        var data = await student.findOneAndUpdate({studentemailid:req.cookies.otp[1]},{studentpassword:req.body.studentpassword})
        if(data){
            console.log("new password successfully");
            req.flash('success', 'new password successfully');
            res.redirect('/student/login')
        }
        else{
            console.log("new password not update");
        }
    } catch (err) {
        console.log(err);
    }
}


//OTP START END















// student dashboard

module.exports.dashboard = async(req,res)=>{

    try {
        var dd= studentjwt.verify(req.cookies.studentjwt,process.env.key)
        const pro=await student.findById(dd.id)
        const studentdata = await student.findById(dd.id);
        res.render('student-dashboard',{
            studentdata,
            pro
        });
    } catch (err) {
        console.log(err); 
    }

}


