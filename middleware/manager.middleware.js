const managerjwt = require('jsonwebtoken');
const manager = require('../model/managermodel')
const manager_token = async(req,res,next)=>{

    var toten = req.cookies.managerjwt
    if(toten){
        console.log("token success");
        var userdata = await managerjwt.verify(toten,process.env.key,(err,data)=>{
            if(err){
                console.log(err);
            }
            return data

        })
        if(userdata == undefined){
                res.redirect('/manager/login')

        }
        else{
            var data = await manager.findById(userdata.id)
            if(data == null){
                res.redirect('/manager/login');
                console.log(data,"hhhhh");
                res.redirect('/manager/login')
            }
            else{
                next();
            }
        }
    }
    else{
        res.redirect('/manager/login')
    }

}




module.exports=manager_token;