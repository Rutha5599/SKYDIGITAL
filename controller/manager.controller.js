const express = require('express');
const manager = require('../model/managermodel');
const student = require('../model/studentmodel')
const cloudinary = require('../cloud/cloudinary');
const managerjwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


// login page

module.exports.loginpage = async(req,res)=>{

    try {
        res.render('manager-login')
    } catch (err) {
        console.log(err);
    }

}


// login post data

module.exports.logindata = async(req,res)=>{

    var email = req.body.email
    var password = req.body.password
    var data = await manager.findOne({email});
    console.log(data,"hhhhhhhh");
    if (data == null) {
        console.log("please register or enter valid email");
        req.flash('success', 'Please Register Valid Email');
        res.redirect('back')

    }
    else {
        if (data.password == password) {
            req.flash('success', 'Loging Successfully');

            console.log(data,"uuuu");
            var token= await managerjwt.sign({id:data.id},process.env.key);
            res.cookie('managerjwt',token,{
                expires:new Date(Date.now()+24*60*60*1000)
            })
            res.redirect('/manager/dashboard');
            console.log("login successfully");
        }
        else {
            console.log(req.body);
            req.flash('success', 'Enter Valid Password')
            res.redirect('back');
            console.log("enter valid password");
        }
    }


}

//OTP start

// resetpassword page

module.exports.resetpasswordpage = async(req,res)=>{
    try {
        res.render('reset-password');
    } catch (err) {
        console.log(err);
        
    }
}

// reset password otp


module.exports.resetpasswordotp = async(req,res)=>{
    try {
        console.log(req.body);
        var emaildata = await manager.findOne({email:req.body.email})
        if(emaildata == null){
            req.flash('success', 'Enter Not Found');
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

            var otp = Math.round(9*8*8*8*9*9);

            var info = transport.sendMail({
                from:"jayaaradhenterprise.info@gmail.com",
                to:emaildata.email,
                html:`OTP = ${otp}`

            });
            if(info){
                console.log("Send OTP successfully");
                req.flash('success', 'Send OTP successfully');

                res.cookie("otp",[otp,emaildata.email]);
                res.render('check-otp')
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
        res.render('newpassword');
    }
    } catch (err) {
        console.log(err);
    }

}

//new password

module.exports.newpassword = async(req,res)=>{

    try {
        console.log(req.body);
        var data = await manager.findOneAndUpdate({email:req.cookies.otp[1]},{password:req.body.password})
        if(data){
            console.log("new password successfully");
            req.flash('success', 'new password successfully');
            res.redirect('/manager')
        }
        else{
            console.log("new password not update");
        }
    } catch (err) {
        console.log(err);
    }
}


//OTP START END



// dashboard page


module.exports.dashboard = async(req,res)=>{

    try {
        const studentdata = await student.find();
        res.render('manager-dashboard',{studentdata});
    } catch (err) {
        console.log(err);
    }

}


// studentdata forms page

module.exports.studentdataform = async(req,res)=>{
    try {
        res.render('studentdataform');
    } catch (err) {
        console.log(err);
    }
}

// student data post


module.exports.studentdatapost = async(req,res)=>{
    try {
        console.log(req.body,req.file);

        var studentname = req.body.studentname
        var fathername = req.body.fathername
        var studentemailid = req.body.studentemailid
        var studentmobile = req.body.studentmobile
        var fathermobile = req.body.fathermobile
        var banchtime = req.body.banchtime
        var course = req.body.course
        var addmisiondate = req.body.addmisiondate


        if(req.file){
            var data = await cloudinary.uploader.upload(req.file.path,{folder:'sos'});
            var img = data.secure_url
            var img_id = data.public_id
        }
        req.body.img = img
        req.body.img_id = img_id

        var studentdata = await student.create({
            studentname,
            fathername,
            studentemailid,
            studentmobile,
            fathermobile,
            banchtime,
            course,
            addmisiondate,
            img,
            img_id
        })

        if(studentdata){
            console.log("data add successfully");
            req.flash('success', 'Data add Successfully')
            res.redirect('/manager/dashboard');
        }
        else{
            req.flash('success', 'Data not add');
            console.log('data not add');
            res.redirect('back');
        }
        
    } catch (err) {
        console.log(err);
    }
}