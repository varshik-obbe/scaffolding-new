import mongoose from "mongoose";
import ParseErrors from "../utils/ParseErrors";
import Product from "../models/product";

exports.add_Product = (req,res)=>{
    const { data } = req.body; 
    const product = new Product({
        _id:mongoose.Types.ObjectId(),
        productname:data.productname,
        productMaterial:data.productMaterials,
        productsuom:data.productsuom,
        productsqtyinmeter:data.productsqtyinmeter,
        productsweight: data.productsweight
    })
    product.save().then((productdata)=>{
        res.status(201).json({productdata:{}})
    })
    .catch((err)=>{
        console.log(err)
        res.status(400).json({errors:ParseErrors(err.errors)})
    }
    )
}




exports.get_SingleProduct = (req,res)=>{

    Product.find({'_id':req.params.id})
    .exec().
    then((productdata)=>{
        const response = {
            count:productdata.length,
            productdata:productdata.map((productrecord)=>({
                id:productrecord._id,
                productname:productrecord.productname,
                productMaterial:productrecord.productMaterial,
                productsuom:productrecord.productsuom,
                productsqtyinmeter:productrecord.productsqtyinmeter,
                productsweight:productrecord.productsweight
            }))
        }
        console.log(response.productdata);
        res.status(200).json({productlist:response});
    })
    .catch((err)=>{
        res.status(500).json({error:{global:"something went wrong"}});
    });


}

exports.get_Product = (req,res)=>{

    // Product.remove({},function (err, founddata) {
    //     res.send({'success':true})
    // })
    Product.find()
    .exec().
    then((productdata)=>{
        const response = {
            count:productdata.length,
            productdata:productdata.map((productrecord)=>({
                id:productrecord._id,
                productname:productrecord.productname,
                productMaterial:productrecord.productMaterial,
                productsuom:productrecord.productsuom,
                productsqtyinmeter:productrecord.productsqtyinmeter,
                productsweight:productrecord.productsweight
            
            }))
        }
        console.log(response.productdata);
        res.status(200).json({productlist:response});
    })
    .catch((err)=>{
        res.status(500).json({error:{global:"something went wrong"}});
    });

}