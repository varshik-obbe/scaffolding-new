import mongoose from "mongoose";
import ParseErrors from "../utils/ParseErrors";
import Currency from "../models/currency";

exports.add_Currency = (req,res)=>{
    const { data } = req.body;
    const currency = new Currency({
        _id:mongoose.Types.ObjectId(),
        currencyname:data.currencyname,
        currencydescription:data.currencydescription
    })
    currency.save().then((currencydata)=>{
        res.status(201).json({currencydata:{}})
    })
    .catch((err)=>res.status(400).json({errors:ParseErrors(err.errors)})); 
}

exports.get_Currency = (req,res)=>{
    Currency.find().exec().
    then((currencydata)=>{
        const response = {
            count:currencydata.length,
            currencydata:currencydata.map((data)=>({
                id:data._id,
                currencyname:data.currencyname
            }))
        }
        res.status(200).json({currencylist:response});
    })
    .catch(()=>{
        res.status(500).json({error:{global:"something went wrong"}});
    });
}