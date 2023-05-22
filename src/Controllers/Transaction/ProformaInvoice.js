import mongoose from 'mongoose';
import async from 'async';
import ParseErrors from '../../utils/ParseErrors';
import ProformaInvoice from '../../models/proformainvoice';

//Temp data
import Workorder from '../../models/workorder';
import Quotation from '../../models/Quotation';
import PurchaseOrder from '../../models/purchaseorder'

exports.add_ProformaInvoice = (req, res) => {
  const { data } = req.body;
  const invoice = new ProformaInvoice({
    _id: mongoose.Types.ObjectId(),
    customerid: data.customerdetail.id,
    customernumber: data.customerdetail.customernumber,
    customername: data.customerdetail.customername,
    customercontactnumber: data.customerdetail.customercontactnumber,
    customergstnumber: data.customerdetail.customergstnumber,
    invoicenumber: data.invoicenumber,
    proformainvoicenumber: data.purchaseordernumber,
    transportchargerequired:data.transportchargerequired,
    remarks:data.remarks,
    user_email:data.user_email,
    date: data.date,
    purchaseorderdate: data.purchaseorderdate,
    invoicedate: data.invoicedate,
    deliverychallannumber: data.deliverychallannumber,
    roundoffamount: data.roundoffamount,
    purchaseordernumber: data.purchaseordernumber,
    goodsDescription:data.goodsDescription,
    vendorcode: data.vendorcode,
    vehiclenumber: data.vehiclenumber,
    hsncode: data.hsncode,
    saccode: data.saccode,
    quotationnumber:data.quotationnumber,
    quotationid: data.quotationid,
    billingaddress: data.billingaddress,
    deliveryaddress: data.deliveryaddress,
    taxableamount: data.taxableamount,
    freightcharges: data.freightcharges,
    subtotal: data.subtotal,
    cgst: data.cgst,
    sgst: data.sgst,
    igst: data.igst,
    tcs: data.tcs,
    total: data.total,
    grandtotal: data.grandtotal,
    deliverychallandata: data.deliverychallandata,
    workorderno : data.workorderno,
    workorderdate : data.workorderdate,
    despathdate : data.despathdate,
    removaltime : data.removaltime,
    transportationcharge : data.transportationcharge,
    transportationgst: data.transportationgst,
    advanceamountreceived : data.advanceamountreceived,
    addeditemlist: data.AddedIteminfo
  });
  invoice
    .save()
    .then(async quotationvalue => {
      const invoicedata = await quotationvalue
        .populate(
          'customerid addeditemlist.itemuom addeditemlist.itemtype',
          '_id masteritemtypename uomname'
        )
        .execPopulate();
      res.status(201).json({ invoicedata });
    })
    .catch(err => res.status(400).json({ errors: ParseErrors(err.errors) }));
};

exports.get_ProformaInvoice = (req, res) => {
  // Delete data temp code
  // Invoice.deleteMany({}, function(){});
  // Workorder.deleteMany({}, function(){});
  // PurchaseOrder.deleteMany({}, function(){});
  // Quotation.deleteMany({}, function(){});

  ProformaInvoice.find()
    .populate(
      'customerid addeditemlist.id addeditemlist.itemuom addeditemlist.itemtype',
      '_id masteritemtypename uomname masteritemname masteritemimage masteritemunitwt'
    )
    .exec()
    .then(invoicedata => {
      const response = {
        count: invoicedata.length,
        invoicedata: invoicedata.map(quotation => ({
          _id: quotation._id,
          customerid: quotation.customerid ? quotation.customerid._id : '',
          customernumber: quotation.customernumber,
          customername: quotation.customername,
          customercontactnumber: quotation.customercontactnumber,
          customergstnumber: quotation.customergstnumber,
          invoicenumber: quotation.invoicenumber,

          transportchargerequired:quotation.transportchargerequired,
          date: quotation.date,
          purchaseordernumber: quotation.purchaseordernumber,
          vendorcode: quotation.vendorcode,
          vehiclenumber: quotation.vehiclenumber,
          hsncode: quotation.hsncode,
          saccode: quotation.saccode,
          billingaddress: quotation.billingaddress,
          deliveryaddress: quotation.deliveryaddress,
          taxableamount: quotation.taxableamount,
          freightcharges: quotation.freightcharges,
          subtotal: quotation.subtotal,
          cgst: quotation.cgst,
          sgst: quotation.sgst,
          igst: quotation.igst,
          tcs: quotation.tcs,
          total: quotation.total,
          remarks:quotation.remarks,
          user_email:quotation.user_email,
          goodsDescription:quotation.goodsDescription,
          grandtotal: quotation.grandtotal,
          addeditemlist: quotation.addeditemlist,
          purchaseorderdate: quotation.purchaseorderdate,
          invoicedate: quotation.invoicedate,
          deliverychallannumber: quotation.deliverychallannumber,
          roundoffamount: quotation.roundoffamount,
          
          deliverychallandata: quotation.deliverychallandata,
          quotationnumber: quotation.quotationnumber,
          quotationid: quotation.quotationid,
          workorderno : quotation.workorderno,
          workorderdate : quotation.workorderdate,
          despathdate : quotation.despathdate,
          removaltime : quotation.removaltime,
          transportationcharge : quotation.transportationcharge,
          transportationgst: quotation.transportationgst,
          advanceamountreceived : quotation.advanceamountreceived
        }))
      };
      console.log(response);
      res.status(200).json({ invoicelist: response });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: { global: 'something went wrong' } });
    });
};


exports.update_proformainvoice = (req,res) =>{
  const { data } = req.body;
  ProformaInvoice.findOne({_id: req.body.data._id}, function (err, founddata) {
      if (err) 
          return res.status(500).send(err);
      else{
          console.log(founddata)
          founddata.customerid = req.body.data.customerdetail.id;
          founddata.customernumber = req.body.data.customerdetail.customernumber;
          founddata.customername = req.body.data.customerdetail.customername;
          founddata.customercontactnumber = req.body.data.customerdetail.customercontactnumber;
          founddata.customergstnumber = req.body.data.customerdetail.customergstnumber;
          founddata.invoicenumber = req.body.data.invoicenumber;
          founddata.remarks = req.body.data.remarks;
          founddata.user_email = req.body.data.user_email,
          founddata.date = req.body.data.date;
          founddata.purchaseorderdate = req.body.data.purchaseorderdate;
          founddata.invoicedate = req.body.data.invoicedate;
          founddata.deliverychallandata = req.body.data.deliverychallandata;
          founddata.workorderno = req.body.data.workorderno;
          founddata.workorderdate = req.body.data.workorderdate;
          founddata.despathdate = req.body.data.despathdate;
          founddata.removaltime = req.body.data.removaltime;
          founddata.transportationcharge = req.body.data.transportationcharge;
          founddata.advanceamountreceived = req.body.data.advanceamountreceived;
          founddata.transportationgst = req.body.data.transportationgst,
          founddata.transportchargerequired = req.body.data.transportchargerequired;
          founddata.deliverychallannumber = req.body.data.deliverychallannumber;
          founddata.roundoffamount = req.body.data.roundoffamount;
          founddata.purchaseordernumber = req.body.data.purchaseordernumber;
          founddata.quotationnumber = req.body.data.quotationnumber,
          founddata.quotationid = req.body.data.quotationid,
          founddata.goodsDescription = req.body.data.goodsDescription;
          founddata.vendorcode = req.body.data.vendorcode;

          founddata.vehiclenumber = req.body.data.vehiclenumber;
          founddata.hsncode = req.body.data.hsncode;
          founddata.saccode = req.body.data.saccode;

          founddata.billingaddress = req.body.data.billingaddress;
          founddata.deliveryaddress = req.body.data.deliveryaddress;
          founddata.taxableamount = req.body.data.taxableamount;
          founddata.freightcharges = req.body.data.freightcharges;

          founddata.subtotal = req.body.data.subtotal;
          founddata.cgst = req.body.data.cgst;
          founddata.sgst = req.body.data.sgst;
          founddata.tcs = req.body.data.tcs,

          founddata.igst = req.body.data.igst;
          founddata.total = req.body.data.total;
          founddata.grandtotal = req.body.data.grandtotal;

          
          founddata.addeditemlist = req.body.data.AddedIteminfo
         
          founddata.save(function (err,updateddata) {
              if (err) 
                  res.status(500).send(err);
  
              res.status(200).json({success:{global:"Challan is updated successfully"}})
          })





          
      }  
  })
}

exports.get_SingleProformaInvoice = (req, res) => {

  ProformaInvoice
  .find({'_id':req.params.id})
    .populate(
      'customerid addeditemlist.id addeditemlist.itemuom addeditemlist.itemtype',
      '_id masteritemtypename uomname masteritemname masteritemimage masteritemunitwt'
    )
    .exec()
    .then(invoicedata => {
      const response = {
        count: invoicedata.length,
        invoicedata: invoicedata.map(quotation => ({
          _id: quotation._id,
          customerid: quotation.customerid ? quotation.customerid._id : '',
          customernumber: quotation.customernumber,
          customername: quotation.customername,
          customercontactnumber: quotation.customercontactnumber,
          customergstnumber: quotation.customergstnumber,
          invoicenumber: quotation.invoicenumber,
          transportchargerequired:quotation.transportchargerequired,
          date: quotation.date,
          purchaseordernumber: quotation.purchaseordernumber,
          vendorcode: quotation.vendorcode,
          vehiclenumber: quotation.vehiclenumber,
          hsncode: quotation.hsncode,
          saccode: quotation.saccode,
          billingaddress: quotation.billingaddress,
          deliveryaddress: quotation.deliveryaddress,
          taxableamount: quotation.taxableamount,
          freightcharges: quotation.freightcharges,
          subtotal: quotation.subtotal,
          cgst: quotation.cgst,
          sgst: quotation.sgst,
          igst: quotation.igst,
          tcs: quotation.tcs,
          total: quotation.total,
          remarks:quotation.remarks,
          user_email:quotation.user_email,
          goodsDescription:quotation.goodsDescription,
          grandtotal: quotation.grandtotal,
          addeditemlist: quotation.addeditemlist,
          purchaseorderdate: quotation.purchaseorderdate,
          invoicedate: quotation.invoicedate,
          deliverychallannumber: quotation.deliverychallannumber,
          roundoffamount: quotation.roundoffamount,
          
          deliverychallandata: quotation.deliverychallandata,
          quotationnumber: quotation.quotationnumber,
          quotationid: quotation.quotationid,
          workorderno : quotation.workorderno,
          workorderdate : quotation.workorderdate,
          despathdate : quotation.despathdate,
          removaltime : quotation.removaltime,
          transportationcharge : quotation.transportationcharge,
          transportationgst: quotation.transportationgst,
          advanceamountreceived : quotation.advanceamountreceived
        }))
      };
      console.log(response);
      res.status(200).json({ invoicelist: response });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: { global: 'something went wrong', error: err } });
    });
};
