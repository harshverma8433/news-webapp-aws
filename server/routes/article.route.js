const express = require("express");
const Article = require("../models/article.model.js")
const router = express.Router()
const multer = require("multer")
const upload = multer();
const jwt = require("jsonwebtoken");
const uploadOnCloudinary = require("../utils/cloudinary.js");
const AuthMiddleware = require("../middlewares/auth.middleware.js");


router.post('/addArticle' , AuthMiddleware ,upload.single("image") , async (req,res)=>{
    console.log(req.body);
    try{
        
        
        const imageurl = await uploadOnCloudinary(req.file.buffer);

        const article = new Article({
            title:req.body.title,
            category:req.body.category,
            image:imageurl,
            author:req.body.author,
            summary : req.body.summary,
            userId : req.user._id
        })

        await article.save();

        return res.status(200).json({message:"Article Added SuccessFully!!!"})

    }catch(error){
        console.log(error);
    }
})

router.get("/getArticles" , async (req,res)=>{
    
    try{
        
        const articles = await Article.find();
        return res.status(200).json({articles});
    }catch(error){
        console.log(error);
    }
})

router.get('/getArticle/:id', AuthMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
      const article = await Article.findById(id).populate('likes');
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
  
      const userId = req.user._id;
      const isLiked = article.likes.some(like => like.equals(userId));
  
      res.status(200).json({ 
        article: {
          ...article._doc,
          isLiked
        },
        userId
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });

router.delete('/deleteArticle/:id' , AuthMiddleware , async (req,res)=>{
    try{
        if(!req.user){
            return res.status(201).json({error:"Unauthorized User! Please Login First!!"})
        }
        const {id} = req.params;
        await Article.findByIdAndDelete(id);
        return res.status(200).json({message:"Article Deleted Successfully!!!"})
    }catch(error){
        console.log(error);
    }
})

router.put('/updateArticle/:id' , AuthMiddleware , upload.single("image")  , async(req,res)=>{

    console.log("update");
    try{
        const {id} = req.params;
        const article = await Article.findById(id);
        if(!article){
            return res.status(201).json({error:"Article Not Found"})
        }

        let imageurl = article.image;
        if(req.file){
            imageurl = await uploadOnCloudinary(req.file.buffer);
        }

        await Article.findByIdAndUpdate(id , {
            $set:{
                title:req.body.title,
                category:req.body.category,
                image:imageurl,
                author : req.body.author,
                summary : req.body.summary

            }
        })

        return res.status(200).json({message:"Article Updated SuccessFully..."});




    }catch(error){
        console.log(error);
    }
})

router.get('/myArticles', AuthMiddleware, async (req, res) => {
    try {
        const articles = await Article.find({ userId: req.user._id });
        res.status(200).json({articles});
    } catch (err) {
        res.status(400).json({error: err});
    }
});

router.post('/likeArticle/:id', AuthMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const article = await Article.findById(id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const userId = req.user._id;
        const isLiked = article.likes.some(like => like.equals(userId));

        if (isLiked) {
            // Unlike the article
            article.likes = article.likes.filter(like => !like.equals(userId));
        } else {
            // Like the article
            article.likes.push(userId);
        }

        await article.save();
        res.status(200).json({ message: isLiked ? 'Article unliked' : 'Article liked', likesCount: article.likes.length, isLiked: !isLiked });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});


router.get('/likedArticles', AuthMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const likedArticles = await Article.find({ likes: userId });

    if (!likedArticles.length) {
      return res.status(404).json({ message: 'No liked articles found' });
    }

    res.status(200).json({ articles: likedArticles });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
    


module.exports = router;