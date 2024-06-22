const Category = require('../models/category');
const mongoose = require('mongoose')

/*
* @const 
* Create category 
**/
const createCategory = async(req, res) => {
    try{
        const category = new Category({
            name:req.body.name,
            color:req.body.color,
            icon:req.body.icon
        })

        const cat = await category.save();
        if(!cat) return res.status(400).json({success:false,message:"Category Not Created"})
        res.status(200).json({success:true,message:"Category Created Succesfuly", result:cat})
    }catch(err){
        res.setatus(500).json({success:false,error:err.message})
    }
}

/*
* @var 
* Get All category detail
**/

const getAllCategory = async(req, res) => {
    try{
        const category = await Category.find();
        if(!category) return res.status(404).json({success:false, message:"Category Not Found !"})
        res.status(200).json({success:true,message:"All Category !",result:category})
    }catch(err){
        res.setatus(500).json({success:false,error:err.message})
    }
}
/*
* @var 
* Update category detail
**/
const updateCategory = async(req, res) => {
    try{
        if(!(mongoose.isValidObjectId(req.params.id))) return res.status(400).json({success:false,message:"Invalid CategoryId !"})
        const categoy = await Category.findByIdAndUpdate(req.params.id, req.body,{new:true});
        if(!categoy) return res.status(404).json({success:false,message:" Category is not updated !"})
        res.status(200).json({success:true,message:"Category updated !",result:categoy})

    }catch(err){
        res.status(500).json({success:false,error:err.message})
    }
}

/*
* @var 
* Find one category detail
**/

const getOneCategoryDetail = async (req, res) => {
    try{
        if(!(mongoose.isValidObjectId(req.params.id))) return res.status(400).json({success:false,message:"Invalid CategoryId !"})

        const category = await Category.findById(req.params.id);
    
        if(!category) return res.status(404).json({success:false, message:"Category not found for this id"})
        res.status(200).json({success:true,result:category})

    }catch(err){
        res.status(500).json({success:false, message:err.message})
    }
}
const deleteCategory = async(req, res) => {
    try{
        if(!(mongoose.isValidObjectId(req.params.id))) return res.status(400).json({success:false,message:"Invalid CategoryId !"})

        const categoy = await Category.findByIdAndDelete(req.params.id);
        if(!categoy) return res.status(404).json({success:false,message:"This Category is not found in Data !"})
         res.status(200).json({success:true,message:"Category Deleted !"})

    }catch(err){
        res.status(500).json({success:false,error:err.message})
    }
}

module.exports = {
    createCategory,
    getAllCategory,
    getOneCategoryDetail,
    updateCategory,
    deleteCategory
}