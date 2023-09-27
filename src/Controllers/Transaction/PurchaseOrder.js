import mongoose from "mongoose";
import async from 'async';
import ParseErrors from "../../utils/ParseErrors";
import PurchaseOrder from "../../models/purchaseorder";
import GenerateReceieptItems from "../../models/generatereceieptitems";
import SupplierDetail from "../../models/supplierlist";
import waterfall from "async-waterfall";

const forEach = require('async-foreach').forEach;

exports.add_PurchaseOrder = (req,res)=>{
    const { data } = req.body;
    const purchaseorder = new PurchaseOrder({
        _id:mongoose.Types.ObjectId(),
        supplierid:data.supplierdetail.id,
        suppliername:data.supplierdetail.suppliername,
        suppliernumber:data.supplierdetail.suppliernumber,
        suppliergstnumber:data.supplierdetail.suppliergstnumber,
        supplieraddress1:data.supplierdetail.supplieraddress1,
        supplieraddress2:data.supplierdetail.supplieraddress2,
        suppliercity:data.supplierdetail.city,
        supplierpincode:data.supplierdetail.pincode,
        supplierstate:data.supplierdetail.state,
        suppliercountry:data.supplierdetail.country,
        suppliercontactid:data.suppliercontactid,
        currencyid:data.currency,
        referenceno:data.refno,
        quotationno:data.quotationno,
        ponumber:data.ponumber,
        cgst:data.cgst,
        sgst:data.sgst,
        igst:data.igst,
        requestdeliverydate:data.requestdeliverydate,
        subject:data.subject,
        totalvalue:data.totalvalue,
        tax:data.gst,
        addeditemlist:data.AddedIteminfo,
        podate:data.podate
    })
    purchaseorder.save().then((purchaseorder)=>{
        res.status(201).json({purchaseorderdata:{}})
    })
    .catch((err)=>{
        console.log(err);
        res.status(400).json({errors:ParseErrors(err.errors)})
    }); 
}





// exports.get_PurchaseOrder = async(req,res)=>{
//    const dbquery = async() =>{
//     const purchaseorder = await PurchaseOrder.find().lean().exec();
//     // console.log(purchaseorder);
//     const supplierdetailinfo = await Promise.all(purchaseorder.map(async(purchaseorderdoc)=>{
//         if(purchaseorderdoc.suppliercontactid){
//             const data =  await SupplierDetail.findOne({"_id":purchaseorderdoc.supplierid}).lean().exec()
//             const suppliercontactlist = data.supplierContactList;
//             if(data._id && suppliercontactlist.length > 0){
//                 const selectedcontact = suppliercontactlist.filter((suppliercontactdoc)=>{
//                     if(suppliercontactdoc._id == purchaseorderdoc.suppliercontactid){
//                         return suppliercontactdoc;
//                     }
//                 }).map((suppliercontactdoc)=>{
//                     const purchaseordevalue ={...purchaseorderdoc};
//                     purchaseordevalue.selectedcontactidlist=suppliercontactdoc;
//                     return purchaseordevalue;
//                 })
//                 return selectedcontact;
//             }
//             return data;
//         }
//             return purchaseorderdoc
        
//     }));
//     return supplierdetailinfo;
//    }

//     try{
//         const purchaseorderlistvalue =  await dbquery()
//         console.log("__START__");
//         console.log(purchaseorderlistvalue);
//         console.log("__END__");
//     }catch(err){
//         console.log(err);
//     }
// }


exports.search_PurchaseOrder = async(req,res) =>{
    console.log("coming to search purchaseorder value");
    const ponumber = req.query.q;
    // PurchaseOrder
    // .findOne({"ponumber":ponumber})
    // .exec()
    // .then((purchaseordervalue)=>{
    //     if(purchaseordervalue){
    //         res.status(200).json({purchaseordervalue});
    //     }else{
    //         res.status(500).json({errors:{global:"something went wrong"}});
    //     }
    // })
    // .catch((err)=>{
    //     res.status(500).json({errors:{global:"something went wrong"}});
    // })

    const purchaseOrder = async() =>{
        const purchaseordervalue = await PurchaseOrder.findOne({"ponumber":ponumber}).exec()
        const receiptpurchaseorderlist = await GenerateReceieptItems.find({"$and":[ {ponumber}, {poid:purchaseordervalue._id}]}).lean().exec();
        if(Array.isArray(receiptpurchaseorderlist) && receiptpurchaseorderlist.length){
            // return purchaseordervalue;
            // const receiptarrayvalue = receiptpurchaseorderlist.map((receiptpurchaseorder)=>receiptpurchaseorder.itemlist);
        }
        return purchaseordervalue;
    }

    try{
        const purchaseordervalue =  await purchaseOrder();
        res.status(200).json({purchaseordervalue});
    }catch(err){
        res.status(500).json({errors:{global:"something went wrong"}});
    }
};


exports.get_SinglePurchaseOrder = (req,res)=>{
    PurchaseOrder
        .find({'_id':req.params.id})
        // .populate('suppliercontactname')
        .exec()
        .then((purchaseorderlist)=>{
                const response = {
                    count:purchaseorderlist.length,
                    purchaseorderlistdata:purchaseorderlist
                        .map((data)=>({
                            id:data._id,
                            supplierid:data.supplierid,
                            suppliername:data.suppliername,
                            suppliernumber:data.suppliernumber,
                            suppliergstnumber:data.suppliergstnumber,
                            supplieraddress1:data.supplieraddress1,
                            supplieraddress2:data.supplieraddress2,
                            suppliercity:data.suppliercity,
                            supplierpincode:data.supplierpincode,
                            supplierstate:data.supplierstate,
                            suppliercountry:data.suppliercountry,
                            suppliercontactid:data.suppliercontactid,
                            currencyid:data.currencyid,
                            referenceno:data.referenceno,
                            ponumber:data.ponumber,
                            requestdeliverydate:data.requestdeliverydate,
                            subject:data.subject,
                            totalvalue:data.totalvalue,
                            gst:data.tax,
                            created_date: data.createdAt,

                            cgst:data.cgst && data.cgst !='' ? data.cgst : '',
                            sgst:data.sgst && data.sgst !='' ? data.sgst : '',
                            igst:data.igst && data.igst !='' ? data.igst : '',
                            addeditemlist:data.addeditemlist
                        })
                    )
                }
            return response;
        }).then((response)=>{
            res.status(200).json({purchaseorderlist:response});
        })
        .catch((err)=>{
            res.status(500).json({error:{global:"something went wrong"}});
        });
}



exports.get_PurchaseOrder = (req,res)=>{
    PurchaseOrder
        .find()
        // .populate('suppliercontactname')
        .exec()
        .then((purchaseorderlist)=>{
                const response = {
                    count:purchaseorderlist.length,
                    purchaseorderlistdata:purchaseorderlist
                        .map((data)=>({
                            id:data._id,
                            supplierid:data.supplierid,
                            suppliername:data.suppliername,
                            suppliernumber:data.suppliernumber,
                            suppliergstnumber:data.suppliergstnumber,
                            supplieraddress1:data.supplieraddress1,
                            supplieraddress2:data.supplieraddress2,
                            suppliercity:data.suppliercity,
                            supplierpincode:data.supplierpincode,
                            supplierstate:data.supplierstate,
                            suppliercountry:data.suppliercountry,
                            suppliercontactid:data.suppliercontactid,
                            currencyid:data.currencyid,
                            referenceno:data.referenceno,
                            ponumber:data.ponumber,
                            requestdeliverydate:data.requestdeliverydate,
                            subject:data.subject,
                            totalvalue:data.totalvalue,
                            created_at: data.createdAt,
                            gst:data.tax,
                            cgst:data.cgst && data.cgst !='' ? data.cgst : '',
                            sgst:data.sgst && data.sgst !='' ? data.sgst : '',
                            igst:data.igst && data.igst !='' ? data.igst : '',
                            addeditemlist:data.addeditemlist
                        })
                    )
                }
            return response;
        }).then((response)=>{
            res.status(200).json({purchaseorderlist:response});
        })
        .catch((err)=>{
            res.status(500).json({error:{global:"something went wrong"}});
        });
}

exports.update_po = (req,res) =>{
    
    PurchaseOrder.findOne({_id: req.body.data._id}, function (err, founddata) {
        if (err) 
            return res.status(500).send(err);
        else{
      
                
                founddata.supplierid = req.body.data.supplierdetail.id;
                founddata.subject = req.body.data.subject;
                founddata.suppliername = req.body.data.supplierdetail.suppliername;
                founddata.suppliernumber = req.body.data.supplierdetail.suppliernumber;
                founddata.suppliergstnumber = req.body.data.supplierdetail.suppliergstnumber;
                founddata.supplieraddress1 = req.body.data.supplierdetail.supplieraddress1;
                founddata.supplieraddress2 = req.body.data.supplierdetail.supplieraddress2;
                founddata.suppliercity = req.body.data.supplierdetail.city;
                founddata.supplierpincode = req.body.data.supplierdetail.pincode;
                founddata.supplierstate = req.body.data.supplierdetail.state;
                founddata.suppliercountry = req.body.data.supplierdetail.country;
                founddata.suppliercontactid = req.body.data.suppliercontactid;
                founddata.currencyid = req.body.data.currency;
                founddata.referenceno = req.body.data.refno;
                founddata.quotationno = req.body.data.quotationno;
                founddata.ponumber = req.body.data.ponumber;
                founddata.requestdeliverydate = req.body.data.requestdeliverydate;
                founddata.subject = req.body.data.subject;
                founddata.cgst = req.body.data.cgst;
                founddata.sgst = req.body.data.sgst;
                founddata.igst = req.body.data.igst;

                founddata.totalvalue = req.body.data.totalvalue;
                founddata.tax = req.body.data.gst;
                founddata.addeditemlist = req.body.data.AddedIteminfo;
                founddata.podate = req.body.data.podate;
                
                founddata.save(function (err,updateddata) {
                    if (err) 
                        res.status(500).send(err);
        
                    res.status(200).json({success:{global:"Enquiry is updated successfully"}})
                })
            
        }  
    })
}



