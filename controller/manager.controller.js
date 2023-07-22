const express = require('express');
const manager = require('../model/managermodel');
const student = require('../model/studentmodel')
const cloudinary = require('../cloud/cloudinary');
const managerjwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


// register page


// module.exports.registerpage = async(req,res)=>{
//     try {
//         res.render('register')
//     } catch (error) {
//         console.log(error);
//     }
// }


//register post data


module.exports.registerdata = async(req,res)=>{

    try {
        console.log(req.body);
        var username = req.body.username
        var email = req.body.email
        var password = req.body.password

        var finds = await student.findOne({ email });
        console.log(finds);
        if (finds == null) {
            var managerdata = await student.create({
                username,
                email,
                password
        });

            req.flash('success', 'Register Successfully')
            res.redirect('back');
        } else {
            req.flash('success', 'Email Alread Exist')
            res.redirect('back');
            console.log("email already exist");
        }
    } catch (err) {
        console.log(err);
    }
}


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


// dashboard page


module.exports.dashboard = async(req,res)=>{

    try {
        const studentdata = await manager.find();
        res.render('manager-dashboard',{
            studentdata
        });
    } catch (err) {
        console.log(err);
    }

}


module.exports.deletes = async (req, res) => {

    try {
        console.log(req.params)
        var cd = await student.findByIdAndDelete(req.params.id);
        if (cd) {
            console.log('data deleted successfully')
            req.flash('success', 'Data Deleted Successfully')
            res.redirect('back');
        } else {
            req.flash('success', 'Data Not Deleted')
            console.log('data not deleted')
        }
    } catch (err) {
        console.log(err);
    }

}


module.exports.updatepage = async(req,res)=>{
    try {
        var data = await student.findById(req.params.id)
        res.render('manager-tables', { data });
    } catch (err) {
        console.log(err);
    }
}




//user table data update



module.exports.updates = async (req, res) => {

    console.log(req.params, req.url)
    console.log(req.body)
    var data = await student.findById(req.params.id);
    if (req.file) {

        cloudinary.uploader.destroy(data.img_id, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(result);
            }
        })

    }
        console.log(req.file);
        if (req.file) {

            var data = await cloudinary.uploader.upload(req.file.path, { folder: 'sos' })
            var img = data.secure_url
            var img_id = data.public_id
        }
        req.body.img = img
        req.body.img_id = img_id
        var email = req.body.email
        var find = await student.findOne({ email });

        console.log(find,'mmmmmmmmm');

        if (find== null) {

            var update = await student.findByIdAndUpdate(req.params.id, req.body);
            if (update) {
                console.log("data updated successfully");
                req.flash('success', 'Data update Successfully')
                res.redirect('/manager/dashboard');
            }
            else {
                req.flash('success', 'Data not update');
                console.log('data not updated');
                res.redirect('back');
            }
        }
        else {
            console.log('updated email already exits');
            req.flash('success', 'updated email already exits');
            res.redirect('back')
        }
    }
    




module.exports.profiles = async(req,res)=>{

    try {
        console.log(req.cookies);
        var decode = await managerjwt.verify(req.cookies.jwt,process.env.key);
        var data= await manager.findById(decode.id)
        res.render('manager-profile',{data})
    } catch (err) {
        console.log(err);
    }
}




