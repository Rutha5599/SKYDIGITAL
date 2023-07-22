const express = require('express');
const admin = require('../model/adminmodel');
const manager = require('../model/managermodel')
const cloudinary = require('../cloud/cloudinary');
const jwt = require('jsonwebtoken');


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

        var finds = await manager.findOne({ email });
        console.log(finds);
        if (finds == null) {
            var managerdata = await manager.create({
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
        res.render('login')
    } catch (err) {
        console.log(err);
    }

}


// login post data

module.exports.logindata = async(req,res)=>{

    var email = req.body.email
    var password = req.body.password
    var data = await admin.findOne({ email });
    if (data == null) {
        console.log("please register or enter valid email");
        req.flash('success', 'Please Register Valid Email');
        res.redirect('back')

    }
    else {
        if (data.password == password) {
            req.flash('success', 'Loging Successfully');

            console.log(data,"uuuu");
            var token= await jwt.sign({id:data.id},process.env.key);
            res.cookie('jwt',token,{
                expires:new Date(Date.now()+24*60*60*1000)
            })
            res.redirect('/admin/dashboard');
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


// dashboard page


module.exports.dashboard = async(req,res)=>{

    try {
        const managerdata = await manager.find();
        res.render('dashboard',{
            managerdata
        });
    } catch (err) {
        console.log(err);
    }

}


module.exports.deletes = async (req, res) => {

    try {
        console.log(req.params)
        var cd = await manager.findByIdAndDelete(req.params.id);
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
        var data = await manager.findById(req.params.id)
        res.render('tables', { data });
    } catch (err) {
        console.log(err);
    }
}




//user table data update



module.exports.updates = async (req, res) => {

    console.log(req.params, req.url)
    console.log(req.body)
    var data = await manager.findById(req.params.id);
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
        var find = await manager.findOne({ email });

        console.log(find,'mmmmmmmmm');

        if (find== null) {

            var update = await manager.findByIdAndUpdate(req.params.id, req.body);
            if (update) {
                console.log("data updated successfully");
                req.flash('success', 'Data update Successfully')
                res.redirect('/admin/dashboard');
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
        var decode = await jwt.verify(req.cookies.jwt,process.env.key);
        var data= await admin.findById(decode.id)
        res.render('profile',{data})
    } catch (err) {
        console.log(err);
    }
}


