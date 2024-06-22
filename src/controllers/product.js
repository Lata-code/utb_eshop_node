const Category = require('../models/category');
const Product = require('../models/product');
const mongoose = require('mongoose');
const multer = require('multer');
const FILE_TYPE_MAP = {
    "image/png":"png",
    "image/jpeg":"jpeg",
    "image/jpg":"jpg"
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const isValid = FILE_TYPE_MAP[file.mimetype];
      let uploadError = new Error('Invalid image type');
      if(isValid){
        uploadError = null;
      }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const fileName = file.originalname.split('.').join('-');
      const extention = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extention}`)
    }
  })
  
  const upload = multer({ storage: storage })

const createProduct = async (req, res) => {
    try{
        const category = await Category.findById(req.body.category);
        if(!category) return res.status(404).json({success:false,message:"invalid Category Id !"})
        const file = req.file;
        if(!file) return res.status(404).json({success:true, message:"No image in the request !"})
        const filename = req.file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
        const product = new Product({
            name: req.body.name,
            descripton: req.body.descripton,
            richDescription: req.body.richDescription,
            image: `${basePath}${filename}`,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            isFeatured: req.body.isFeatured
        });

        // await product.save().then((result) =>{
        //     res.status(200).json({success:true, message:"Product created successfuly", result:result})
        // }).catch((err)=>{
        //     res.status(500).json({message:err})
        // })

        const productInfo = await product.save();
        if(!productInfo) return res.status(400).json({success:false,message:"Product not created !"})
        res.status(200).json({success:true, message:"Product created successfuly", result:productInfo})

    }catch(err){
        res.status(500).json({message:err})
    }
}

const getAllProduct = async(req, res)=>{
    try{
        let filter = {};
        if(req.query.categories){
            filter = {category: req.query.categories.split(',')}
        }

        //const result = await Product.find().select('name image -_id'); // by default id field is come if we want exclude id then use -_id
        const result = await Product.find(filter).populate('category'); // for populating the category data

        if(!result) return res.status(404).json({success:false,message:"No Data Found"})
        const productCount = result.length;
        res.status(200).json({success:true,message:"All Products",count:productCount, result:result})

    }catch(err){
        res.status(500).json({message:err})
    }
}

/* 
* @var
* Get One Product detail API
**/
const getOnePoductDetail = async(req, res)=>{
    try{
        if(!(mongoose.isValidObjectId(req.params.id))) return res.status(400).json({success:false,message:"Invalid productId !"})
        const product = await Product.findById(req.params.id).populate('category');
        if(!product) return res.status(404).json({success:false,message:"No product Found for this id"})

        res.status(200).json({success:true, result:product})

    }catch(err){
        res.status(500).json({message:err})
    }
}

/* 
* @var
* update Product
**/
const updateProduct = async(req, res)=>{
    try{
        if(!(mongoose.isValidObjectId(req.params.id))) return res.status(400).json({success:false,message:"Invalid productId !"})
       
        const category = await Category.findById(req.body.category);
        if(!category) return res.status(404).json({success:false,message:"invalid Category Id !"})
       
        const product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true}).populate('category');
        if(!product) return res.status(404).json({success:false,message:"No product Found for this id"})

        res.status(200).json({success:true, result:product})

    }catch(err){
        res.status(500).json({message:err})
    }
}

/* 
* @var
* delete Product API
**/
const deleteProduct = async(req, res)=>{
    try{
        if(!(mongoose.isValidObjectId(req.params.id))) return res.status(400).json({success:false,message:"Invalid productId !"})

        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product) return res.status(404).json({success:false,message:"No product deleted for this id"})

        res.status(200).json({success:true, message:"product deleted successfuly"})

    }catch(err){
        res.status(500).json({message:err})
    }
}

/* 
* @var
* Count Documents in collestion API
**/
const countProduct = async(req, res)=>{
    try{

        const productCount = await Product.countDocuments({});
        
                
        if(!productCount) return res.status(404).json({success:false,message:"No product count"})

        res.status(200).json({success:true, productCount:productCount})

    }catch(err){
        res.status(500).json({message:err})
    }
}

/* 
* @var
* FeaturedProduct API
**/
const featuredProduct = async(req, res)=>{
    try{
        const count = req.params.count??0;
        const product = await Product.find({isFeatured:true}).limit(+count);               
        if(!product) return res.status(404).json({success:false,message:"No feature product found"})

        res.status(200).json({success:true,count:product.length, product:product})

    }catch(err){
        res.status(500).json({message:err})
    }
}

/* 
* @var
* galleryImages API
**/
const galleryImages = async(req, res) => {
    try{
        if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({success:false, message:"Invalid Product ID !"});
        const files = req.files;
        const basepath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        
        let imagePaths = [];
        if(files){
            files.map((file) =>{
                imagePaths.push(`${basepath}${file.filename}`)
            })
        }
        // const product = await Product.findByIdAndUpdate(req.params.id,{
        //     images:imagePaths
        // },{new:true})

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $push: { images: { $each: imagePaths } } },
            { new: true }
        );
        

        if(!product) return res.status(404).json({success:false, message:"Product not found For this id !"})
        res.status(200).json({success:true,message:"Image gallery updated !" ,result:product})
    }catch(err){
        res.status(500).json({success:false, message:err})
    }
}

module.exports = {
    createProduct,
    getAllProduct,
    getOnePoductDetail,
    updateProduct,
    deleteProduct,
    countProduct,
    featuredProduct,
    galleryImages,
    upload
}