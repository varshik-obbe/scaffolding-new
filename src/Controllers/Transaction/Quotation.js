import mongoose from "mongoose";
import async from 'async';
import ParseErrors from "../../utils/ParseErrors";
import Quotation from "../../models/Quotation";

exports.add_Quotation = (req,res) =>{
 const { data } = req.body;
 const quotation = new Quotation({
    _id:mongoose.Types.ObjectId(),
    customerid:data.customerdetail.id,
    customernumber:data.customerdetail.customernumber,
    customername:data.customerdetail.customername,
    customercontactnumber:data.customerdetail.customercontactnumber,
    customergstnumber:data.customerdetail.customergstnumber,
    quotationnumber:data.quotationnumber,
    customeraddress: data.customeraddress,
    date:data.date,
    tax:data.gst,
    tcs:data.tcs,

    tcharge:data.tcharge,
    
    ws:data.ws,
    loadingcharge:data.loadingcharge,
    transportationgst: data.transportationgst,
    subject:data.subject,
    totalvalue:data.totalvalue,
    addeditemlist:data.AddedIteminfo
})
quotation.save().then(async(quotationvalue)=>{
    const quotationdata = await quotationvalue.populate('customerid addeditemlist.itemuom addeditemlist.itemtype','_id masteritemtypename uomname').execPopulate();
    res.status(201).json({quotationdata})
})
.catch((err)=>res.status(400).json({errors:ParseErrors(err.errors)}));
}

exports.get_singleQuotation = (req,res) =>{
    Quotation
        .find({'_id':req.params.id})
        .populate('customerid addeditemlist.id addeditemlist.itemuom addeditemlist.itemtype','_id masteritemtypename uomname masteritemname masteritemimage masteritemunitwt')
        .exec()
        .then(quotationdata => {
            console.log(quotationdata)
            const response = {
                count: quotationdata.length,
                quotationdata: quotationdata.map((quotation)=>({
                        _id:quotation._id,
                        customerid:quotation.customerid._id,
                        customernumber:quotation.customernumber,
                        customername:quotation.customername,
                        customeraddress:quotation.customeraddress ? quotation.customeraddress : '',
                        customercontactnumber:quotation.customercontactnumber,
                        customergstnumber:quotation.customergstnumber,
                        quotationnumber:quotation.quotationnumber,
                        date:quotation.date,
                        tax:quotation.tax,
                        tcs:quotation.tcs,
                        tcharge:quotation.tcharge,
                        transportationgst:quotation.transportationgst,
                        ws:quotation.ws,
                        loadingcharge:quotation.loadingcharge,
                        subject:quotation.subject,
                        totalvalue:quotation.totalvalue,
                        addeditemlist:quotation.addeditemlist
                    }))
            }
            console.log(response);
     
            res.status(200).json({quotationlist:response});
        })
        .catch((err)=>{
            console.log(err);
            res.status(500).json({error:{global:"something went wrong"}});
        })
}

exports.get_Quotation = (req,res) =>{
    Quotation
        .find()
        .populate('customerid addeditemlist.id addeditemlist.itemuom addeditemlist.itemtype','_id masteritemtypename uomname masteritemname masteritemimage masteritemunitwt')
        .exec()
        .then(quotationdata => {
            console.log(quotationdata)
            const response = {
                count: quotationdata.length,
                quotationdata: quotationdata.map((quotation)=>({
                        _id:quotation._id,
                        customerid:quotation.customerid._id,
                        customernumber:quotation.customernumber,
                        customername:quotation.customername,
                        customercontactnumber:quotation.customercontactnumber,
                        customergstnumber:quotation.customergstnumber,
                        quotationnumber:quotation.quotationnumber,
                        customeraddress:quotation.customeraddress ? quotation.customeraddress : '',
                        date:quotation.date,
                        tax:quotation.tax,
                        tcs:quotation.tcs,
                        tcharge:quotation.tcharge,
                        transportationgst:quotation.transportationgst,
                        ws:quotation.ws,
                        loadingcharge:quotation.loadingcharge,
                        subject:quotation.subject,
                        totalvalue:quotation.totalvalue,
                        addeditemlist:quotation.addeditemlist
                    }))
            }
            console.log(response);
            res.status(200).json({quotationlist:response});
        })
        .catch((err)=>{
            console.log(err);
            res.status(500).json({error:{global:"something went wrong"}});
        })
}


exports.update_quotation = (req,res) =>{
    
    Quotation.findOne({_id: req.body.data._id}, function (err, founddata) {
        if (err) 
            return res.status(500).send(err);
        else{

            founddata.customerid = req.body.data.customerdetail.id,
            founddata.customernumber = req.body.data.customerdetail.customernumber,
            founddata.customername = req.body.data.customerdetail.customername,
            founddata.customercontactnumber = req.body.data.customerdetail.customercontactnumber,
            founddata.customergstnumber = req.body.data.customerdetail.customergstnumber,
            founddata.quotationnumber = req.body.data.quotationnumber,
            founddata.date = req.body.data.date,
            founddata.tax = req.body.data.gst,
            founddata.tcs = req.body.data.tcs,
            founddata.subject = req.body.data.subject,
            founddata.totalvalue = req.body.data.totalvalue,
            founddata.customeraddress =  req.body.data.customeraddress,
            founddata.addeditemlist = req.body.data.AddedIteminfo
            founddata.tcharge = req.body.data.tcharge,
            founddata.transportationgst = req.body.data.transportationgst,
            founddata.ws = req.body.data.ws,
            founddata.loadingcharge = req.body.data.loadingcharge
          
                
            founddata.save(function (err,updateddata) {
                if (err) 
                    res.status(500).send(err);
    
                res.status(200).json({success:{global:"Quotation is updated successfully"}})
            })
            
        }  
    })
}