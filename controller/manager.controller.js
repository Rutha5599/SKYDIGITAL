const express = require('express');
const manager = require('../model/managermodel');
const student = require('../model/studentmodel');
const studentfees = require('../model/studentfeesmodel');
const cloudinary = require('../cloud/cloudinary');
const managerjwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { name } = require('ejs');


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

            var otp = Math.round(Math.random()*9*8*9*8*9*8);

            var info = transport.sendMail({
                from:"jayaaradhenterprise.info@gmail.com",
                to:emaildata.email,
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
        var dd= managerjwt.verify(req.cookies.managerjwt,process.env.key)
        const pro=await manager.findById(dd.id)
        const studentdata = await student.find();
        res.render('manager-dashboard',{
            studentdata,
            pro
        });
    } catch (err) {
        console.log(err); 
    }

}


//manager profiles

module.exports.profiles = async (req, res) => {

    try {
        var dd= managerjwt.verify(req.cookies.managerjwt,process.env.key)
        const pro=await manager.findById(dd.id)
        console.log(req.cookies);
        var decode = await managerjwt.verify(req.cookies.managerjwt,process.env.key);
        var managerporfiles = await manager.findById(decode.id)
        res.render('manager-profile', { managerporfiles,pro })
    } catch (err) {
        console.log(err);
    }
}


// studentdata forms page

module.exports.studentdataform = async(req,res)=>{
    try {
        var dd= managerjwt.verify(req.cookies.managerjwt,process.env.key)
        const pro=await manager.findById(dd.id)
        res.render('studentdataform',{pro});
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
        var studentaddress = req.body.studentaddress
        var course = req.body.course
        var fees =req.body.fees
        var addmisiondate = req.body.addmisiondate
        var studentpassword = req.body.studentmobile
        var emailfind = await student.findOne({studentemailid})

        if(emailfind == null){
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
                studentaddress,
                studentemailid,
                studentmobile,
                fathermobile,
                banchtime,
                course,
                studentpassword,
                fees,
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
        }
        else{
            req.flash('success',"email already exists")
            res.redirect('back')
        }
        
    } catch (err) {
        console.log(err);
    }
}


// student data delete

module.exports.deletes = async(req,res)=>{
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


// student data update page

module.exports.updatepage = async (req, res) => {
    try {
        var dd= managerjwt.verify(req.cookies.managerjwt,process.env.key)
        const pro=await manager.findById(dd.id)
        var datastudent = await student.findById(req.params.id)
        res.render('student-tables',{
            datastudent,
            pro
        });
    } catch (err) {
        console.log(err);
    } 
}



// student data update


module.exports.updates = async (req, res) => {

    console.log(req.params,req.url)
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
    console.log(req.body,"sajkasfjahfjh");
    var email = req.body.studentemailid
    console.log(email,"yy");
    var find = await student.findOne({ studentemailid:email });

    console.log(find, 'mmmmmmmmm');

    if (find == null) {

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


// student details


module.exports.studentdetails = async(req,res)=>{
    try {
        var dd= managerjwt.verify(req.cookies.managerjwt,process.env.key)
        const pro=await manager.findById(dd.id)
        var datastudent = await student.findById(req.params.id)
        var fees =await studentfees.find({student_id:req.params.id});
        var last = fees.slice(-1);
        if(last.length==1){
            var pendingfees = datastudent.fees-last[0].feesamount
            console.log(pendingfees,"fsdfwsf");
            var paidfees = parseInt(datastudent.paidfees) + parseInt(last[0].feesamount)
        }
        res.render('student-profile',{
            datastudent,
            pro,
            last
        });
    } catch (err) {
        console.log(err);
    } 
}

module.exports.studentfees = async(req,res)=>{

    try {
        console.log(req.body);

        const{feesamount,paymenttype,date}=req.body

        var student_id = req.params.id
        var datastudent = await student.findById(req.params.id)

        var fees =await studentfees.find({student_id:req.params.id});
        var last = fees.slice(-1);

                var paidfees = parseInt(datastudent.paidfees) + parseInt(req.body.feesamount)
                console.log(paidfees);

                 var pendingfees = datastudent.fees - paidfees
                console.log(pendingfees,"fsdfwsf");

            var update = await student.findByIdAndUpdate(req.params.id,{pendingfees,paidfees})

        var fees = await studentfees.create({
        feesamount,
        paymenttype,
        date,
        student_id
    })
    if(fees){
        console.log("fess updated successfully");
        req.flash('success', 'Fees update Successfully')
        res.redirect('back');
    }
    else{
        req.flash('success', 'Fees not add')
        res.redirect('back');
    }
    } catch (err) {
        console.log(err);
        
    }

}