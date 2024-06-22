const Order = require('../models/order')
const OrderItem = require('../models/orderItem')
const mongoose = require('mongoose')

/*
* @var 
* Create Order Api
**/
const createOrder = async (req, res) =>{
    try{
        const orderitemsIds = Promise.all(req.body.orderitems.map(async orderitm => {
            let orderitem = new OrderItem ({
                quantity:orderitm.quantity,
                product: orderitm.product    
            }) ;
            orderitem  = await orderitem.save();
            return orderitem._id;
        }))

        const orderitemsIdsResolved = await orderitemsIds;

        const totalprices =await Promise.all( orderitemsIdsResolved.map(async orderItemId=>{
            const orderitem = await OrderItem.findById(orderItemId).populate('product','price');
            const totalprice = orderitem.quantity * orderitem.product.price;
            return totalprice;
        }));

        const totalPrice = totalprices.reduce((a,b)=>a+b, 0)
        
        
        const order = new Order({
            orderitems:orderitemsIdsResolved,
            shippingAddress1:req.body.shippingAddress1,
            shippingAddress2:req.body.shippingAddress2,
            city:req.body.city,
            zip:req.body.zip,
            country:req.body.country,
            phone:req.body.phone,
            status:req.body.status,
            totalPrice:totalPrice,
            user:req.body.user, 
        })

        const orderInfo = await order.save();
        if(!orderInfo) return res.status(404).json({success:false, message:"Order Not Created ! "});
        res.status(200).json({success:true, message:"Order Created Successfyly ! ", result:orderInfo})

    }catch(err){
        res.status(500).json({success:false, message:err})
    }

}

/*
* @var 
* Get All Order Api
**/

const getAllOrder = async (req, res) =>{
    try{
        const allOrders = await Order.find().populate('user','name').sort({'dateOrdered':-1});
        if(!allOrders) return res.status(404).json({success:false, message:"No Order Found !"})
        res.status(200).json({success:true, message:"All Oreders" , count:allOrders.length, result: allOrders})
    }catch(err){
        res.status(500).json({success:false, message:err})
    }

}

/*
* @var 
* Get One Order detail Api
**/

const oneOrderDetail = async (req, res) =>{
    try{
        if(!(mongoose.isValidObjectId(req.params.id))) return res.status(400).json({success:false,message:"Invalid orderId !"})

        const order = await Order.findById(req.params.id).populate('user','name').populate({
            path:'orderitems', populate:{
                path:'product',populate:'category'
            }
        });
         
        if(!order) return res.status(404).json({success:false, message:"No Order found for this id !"})
        res.status(200).json({success:true, result:order})
    }catch(err){
        res.status(500).json({success:false, message:err})
    }

}

/*
* @var 
* Update Order Api
**/
const updateOrder = async (req, res) =>{
    try{
        if(!(mongoose.isValidObjectId(req.params.id))) return res.status(400).json({success:false,message:"Invalid orderId !"})
        const order = await Order.findByIdAndUpdate(req.params.id,{
            status:req.body.status
        },{new:true})

        if(!order) return res.status(404).json({success:false, message:"Order is Not updated !"})
        res.status(200).json({success:true,message:"Order Updated successfuly !", result:order})
   

    }catch(err){
        res.status(500).json({success:false, message:err})
    }

}

/*
* @var 
* Delete Order Api
**/

const deleteOrder = async (req, res) =>{
    try{
        if(!(mongoose.isValidObjectId(req.params.id))) return res.status(400).json({success:false,message:"Invalid orderId !"})
        const order =  Order.findByIdAndDelete(req.params.id).then(async order =>{
            if(order){
                await order.orderitems.map(async orderItmes =>{
                    await OrderItem.findByIdAndDelete(orderItmes)
                })
              return  res.status(200).json({success:true, message:"Order is Deleted !"})

            }else{
                return res.status(404).json({success:false, message:"Order is Not Deleted ! "})
            }
        });
        // if(!order) return res.status(404).json({success:false, message:"Order is Not Deleted ! "})
        // res.status(200).json({success:true, message:"Order is Deleted !"})
    }catch(err){
        res.status(500).json({success:false, message:err})
    }

}

const totalSales = async (req,res) => {
    try{
        const totalSales = await Order.aggregate([
            { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
          ]);

        if(!totalSales) return res.status(404).json({success:false, message:"No totalSales Found !"})
        res.send(totalSales)

    }catch(err){
        res.status(500).json({success:false, message:err})
    }
}

const orderCount = async (req, res) =>{
    try{
        const count = await Order.countDocuments({})

        if(!count) return res.status(404).json({success:false,message:"No Documents Find !"})
        res.status(200).json({success:true, count:count})

    }catch(err){
        res.status(500).json({success:false, message:err})
    }
}

const userOrders = async (req, res)=>{
    try{
        const userOrder = await Order.find({user:req.params.userid}).populate({
            path:'orderitems', populate:{
                path:'product',populate:'category'
            }}).sort({'dateOrdered':-1});
        if(!userOrder) return res.status(404).json({success:false, message:"There is no order found for this user id !"})
        res.status(200).json({success:true, count:userOrder.length, result:userOrder})

    }catch(err){
        res.status(500).json({success:false, message:err})
    }
}


module.exports = {
    createOrder,
    deleteOrder,
    updateOrder,
    oneOrderDetail,
    getAllOrder,
    totalSales,
    orderCount,
    userOrders
    
}