const studentjwt = require('jsonwebtoken');
const student = require('../model/studentmodel')
const student_token = async(req,res,next)=>{

    var toten = req.cookies.studentjwt
    if(toten){
        console.log("token success");
        var userdata = await studentjwt.verify(toten,process.env.key,(err,data)=>{
            if(err){
                console.log(err);
            }
            return data

        })
        if(userdata == undefined){
                res.redirect('/student/login')

        }
        else{
            var data = await student.findById(userdata.id)
            if(data == null){
                res.redirect('/student/login');
                console.log(data,"hhhhh");
                res.redirect('/student/login')
            }
            else{
                next();
            }
        }
    }
    else{
        res.redirect('/student/login')
    }

}




module.exports=student_token;