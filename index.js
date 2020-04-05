const express=require('express');
const app=express();
const mongoose=require('mongoose');
const mongoURI='mongodb://localhost:27017/react-blog';

mongoose.connect(mongoURI,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log('connected to mongodb successfully!'))
.catch(err=>console.log(err));


app.get('/',(req,res)=>{
    res.send('Hello World!');
})

app.listen(5000,()=>{
    console.log(`Server up and running on port 5000`);
})