const express = require('express');
const path = require('path');
const flash=require('express-flash');
const session=require('express-session');
const cookieparser = require('cookie-parser');
const port =8000;
const app=express();
require('dotenv').config()
app.use(cookieparser());
app.use(flash());

app.use(session({
    secret:'mysecret',
    saveUninitialized:false,
    resave:false
}))

require('./config/db')
const bodyparser=require('body-parser');
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'assets')))
app.use(express.static(path.join(__dirname,'public')))


app.use('/admin',require('./routes/adminrouter'));
app.use('/manager',require('./routes/managerrouter'));

app.get('/admin',(req,res)=>{
    res.redirect('/admin/login')
});

app.get('/manager',(req,res)=>{
    res.redirect('/manager/login')
});

app.get('/',(req,res)=>{
    res.redirect('/user')
})

app.use((req,res)=>{
    res.render('err');
})



app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return false
    }
    console.log('server is running', port);
})