const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name:{type:String, required:true},
    descripton:{type:String, required:true},
    richDescription:{type:String, required:true},
    image:{type:String, default:''},
    images:[{type:String}],
    brand:{type:String, default:''},
    price:{type:Number, default:0},
    category:{type:mongoose.Schema.Types.ObjectId, ref:'Category',required:true},
    countInStock:{type:Number,default:0, required:true, min:0,max:255},
    rating:{type:Number,default:0, required:true},
    isFeatured:{type:Boolean, default:false,required:true},
    dateCreated:{type:Date, default:Date.now()},
},{timestamps:true});

productSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

productSchema.set('toJSON',{virtuals:true})


module.exports = mongoose.model('Product',productSchema);

