const express = require("express");
const app = express ();
const mongoose = require ("mongoose");
const dbURI = "mongodb+srv://sukriti:98Sj4B3fzXQxxEH@cluster0.utfp6.mongodb.net/blog-db?retryWrites=true&w=majority";
const Blog = require("./models/blog");

app.set("view engine","ejs");
app.use(express.static("Public"));
app.use(express.urlencoded({extended:true}));

mongoose.connect(dbURI)
.then(result => {
    app.listen(5000);
})
.catch(err => console.log(err));

app.get("/add-blog", (req,res)=>{
    const blog = new Blog({
        title: "best language for machine learning",
        snippet: "python, R, Julia",
        body: "random body"
    });
    blog.save()
     .then(result => {
         res.send(result);
     })
     .catch(err => {
         console.log(err);
     })
});

//! showing the blogs in the home page
app.get("/blogs", (req,res)=>{
    Blog.find().sort({createdAt: -1})
    .then(result => {
        res.render("home", {title: "All Blogs", blogs: result})
    })
    .catch(err => console.log(err));
});

app.post("/blogs", (req,res)=>{
    const blog = new Blog(req.body);
    blog.save()
    .then(result => {
        res.redirect("/blogs");
    })
    .catch(err => console.log(err));
});

app.get("/blogs/:id", (req,res)=>{
const id = req.params.id;
Blog.findById(id)
 .then (result => {
    res.render("details", {title:result.title, blog: result});
 })
 .catch(err => console.log(err));
});

app.delete ("/blogs/:id", (req,res)=>{
const id = req.params.id;
Blog.findByIdAndDelete(id)   
.then (response => {
    res.json({redirect:"/blogs"})
})
.catch(err => console.log(err));
});

app.get("/",(req,res)=>{
  res.redirect("/blogs");
});
app.get("/about",(req,res)=>{
    res.render("about", {title: "About Us"});
})
app.get("/create",(req,res)=>{
    res.render("blog",  {title: "Create Blog"});
})
app.get("/contact",(req,res)=>{
    res.render("contact",  {title: "Contact Us"});
})
app.use((req,res)=>{
    res.status("404").send("<h2> 404 error </h2>");
})