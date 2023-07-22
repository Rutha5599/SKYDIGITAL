const jwt = require('jsonwebtoken');
const admin = require('../model/adminmodel')

const admin_token = async(req,res,next)=>{
  
    var toten = req.cookies.jwt
    console.log(toten,"ujj");
    if(toten){
        console.log("token success");
        var userdata = await jwt.verify(toten,process.env.key,(err,data)=>{
            if(err){
                console.log(err);
            }
            return data

        })
        console.log(userdata,"pp");
        if(userdata == undefined){
                res.redirect('/admin/login')

        }
        else{
            console.log(userdata,"ffffffffff");
            var data = await admin.findById(userdata.id)
            console.log(data,userdata);
            if(data == null){
                console.log(data,"hh");
                res.redirect('/admin/login')
            }
            else{
                next();
            }
        }
    }
    else{
        res.redirect('/admin/login')
    }

}




module.exports=admin_token;