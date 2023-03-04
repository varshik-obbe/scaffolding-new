import mongoose from "mongoose";
import Customer from "../../models/customer";
import ParseErrors from "../../utils/ParseErrors";

exports.add_Customer = (req,res)=>{
    const { data } = req.body;
    const customer = new Customer({
        _id:mongoose.Types.ObjectId(),
        customernumber:data.customernumber,
        customername:data.customername,
        customercontactnumber:data.customercontactnumber,
        customergstnumber:data.customergstnumber,
        customeraddress1:data.customeraddress1,
        customeraddress2:data. customeraddress2,
        city:data.city,
        pincode:data.pincode,
        state:data.state,
        country:data.country,
        deliveryAddress:data.deliveryAddress,
        codate:data.codate,
        createdby: req.currentUser[0]._id
    })
    customer.save().then((customervalue)=>{
        const  
        {
            _id:id,
            customername,
            customercontactnumber,
            customergstnumber,
            customeraddress1,
            customeraddress2,
            city,
            pincode,
            state,
            country,
            customernumber,
            deliveryAddress,
            codate
        } 
         = { ...customervalue._doc} ;
        const customerdata = Object.assign(
            {},
            {
                id,
                customername,
                customercontactnumber,
                customergstnumber,
                customeraddress1,
                customeraddress2,
                city,
                pincode,
                state,
                country,
                customernumber,
                deliveryAddress,
                codate
            }
        );
        res.status(201).json({customerdata})
    })
    .catch((err)=>{
        res.status(400).json({errors:ParseErrors(err.errors)})
    }); 
}

exports.get_Customer = (req,res) =>{
    Customer.find().exec().then((customerdata)=>{
        const response = {
            count:customerdata.length,
            customerdata:customerdata.map((customervalue)=>({
                    id:customervalue._id,
                    customername:customervalue.customername,
                    customercontactnumber:customervalue.customercontactnumber,
                    customergstnumber:customervalue.customergstnumber,
                    customeraddress1:customervalue.customeraddress1,
                    customeraddress2:customervalue.customeraddress2,
                    city:customervalue.city,
                    pincode:customervalue.pincode,
                    state:customervalue.state,
                    country:customervalue.country,
                    customernumber:customervalue.customernumber,
                    codate:customervalue.codate,
                    deliveryAddress:customervalue.deliveryAddress
                })) 
        }
        res.status(200).json({customerlist:response});
    }).catch((err)=>{
        res.status(400).json({error:{global:"something went wrong"}});
    })
}

exports.update_Customer = (req,res) =>{
    const { data } = req.body;
    const id = data.id;
    data.updatedby = req.currentUser[0]._id;
    Customer.findOneAndUpdate({_id: id}, {$set: data},{new: true}).exec()
    .then((updateddata)=>{
        res.status(200).json({success:{global:"customer details is updated successfully"}})
    })
    .catch((err)=>{
        res.status(400).json({error:{global:"something went wrong"}});
    })
}