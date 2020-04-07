const express=require('express');
const app=express();
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');


const User = require('./models/user');
const {auth} = require('./middleware/auth');
const config=require('./config/key');


mongoose.connect(config.mongoURI,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log('connected to mongodb successfully!'))
.catch(err => console.log(err));


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send('hello, happy to deploy our application');
});

app.get('/api/users/auth',auth,(req,res)=>{

    const {_id,email,name,lastname,role}=req.user;
    res.status(200).json({
        _id,
        isAuth:true,
        email,
        name,
        lastname,
        role,
    })
})

app.get('/',(req,res)=>{
    res.send('Hello World!');
})

app.post('/api/users/register',(req,res)=>{
    
    const newUser=new User(req.body);
    newUser.save((err,userData)=>{
        if (err) return res.json({success:false, err});
        res.status(200).json({success:true,userData});
    })
    //return res.status(200).json({success:true});
})

app.post('/api/users/login',(req,res)=>{
    User.findOne({email: req.body.email},(err,user)=>{
        if (err) return res.json({loginSuccess:false, err});
        if(!user) return res.json({loginSuccess:false, message:'Auth failed, email not found.'});
        //compare password
        user.comparePassword(req.body.password,(err,isMatch)=>{
            if(!isMatch){
                return res.json({loginSuccess:false, message:'wrong password'});
            }

            //generate token
            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);
                console.log('user: ',user);
                res.cookie('x_auth', user.token).status(200).json({loginSuccess:true})
            })

        });
        

    })
})

app.get('/api/users/logout',auth,(req,res)=>{
    User.findOneAndUpdate({_id:req.user._id},{token:''},(err,doc)=>{
        if (err) return res.json({success:false, err});
        res.status(200).send({success:true});
    })
})


const port=process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server up and running on port ${port}`);
})