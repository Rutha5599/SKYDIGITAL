const userjwt = require('jsonwebtoken');
const user = require('../model/managermodel')
const user_token = async(req,res,next)=>{
    var toten = req.cookies.userjwt
    if(toten){
        console.log("token success");
        var userdata = await userjwt.verify(toten,process.env.key,(err,data)=>{
            if(err){
                console.log(err);
            }
            return data

        })
        if(userdata == undefined){
                res.redirect('/user/login')

        }
        else{
            var data = await user.findById(userdata.userid)
            if(data == null){
                res.redirect('/user/login');
                console.log(data,userdata);
            }
            else{
                next();
            }
        }
    }
    else{
        res.redirect('/user/login')
    }

}




module.exports=user_token;