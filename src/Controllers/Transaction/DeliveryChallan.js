import mongoose from 'mongoose';
import async from 'async';
import ParseErrors from '../../utils/ParseErrors';
import Challan from '../../models/DeliveryChallan';

exports.add_Challan = (req, res) => {
  const { data } = req.body;
  const challan = new Challan({
    _id: mongoose.Types.ObjectId(),
    addeditemlist: data.AddedIteminfo,
    deliverychallanno: data.deliverychallanno,
    toaddress: data.toaddress,
    site: data.site,
    date: data.date,
    ponumber: data.ponumber,
    podate: data.podate,
    vehiclenumber: data.vehiclenumber,
    gstno: data.gstno,
    mobilenumber: data.mobilenumber,
    otherreference: data.otherreference
  });
  challan
    .save()
    .then(async quotationvalue => {
      const challandata = await quotationvalue
        .populate(
          'customerid addeditemlist.itemuom addeditemlist.itemtype',
          '_id masteritemtypename uomname'
        )
        .execPopulate();
      res.status(201).json({ challandata });
    })
    .catch(err => res.status(400).json({ errors: ParseErrors(err.errors) }));
};
exports.get_Challan = (req, res) => {
 
  Challan.find()
    .populate(
      'customerid addeditemlist.id addeditemlist.itemuom addeditemlist.itemtype addeditemlist.itemuom',
      '_id masteritemtypename uomname masteritemname masteritemimage masteritemunitwt'
    )
    .exec()
    .then(invoicedata => {
      const response = {
        count: invoicedata.length,
        challandata: invoicedata.map(data => ({
          _id: data.id,
          addeditemlist: data.addeditemlist,
          deliverychallanno: data.deliverychallanno,
          toaddress: data.toaddress,
          site: data.site,
          date: data.date,
          ponumber: data.ponumber,
          podate: data.podate,
          vehiclenumber: data.vehiclenumber,
          gstno: data.gstno,
          mobilenumber: data.mobilenumber,
          otherreference: data.otherreference
        }))
      };
      console.log(response);
      res.status(200).json({ challanlist: response });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: { global: 'something went wrong' } });
    });
};



exports.update_challan = (req,res) =>{
    
  Challan.findOne({_id: req.body.data._id}, function (err, founddata) {
      if (err) 
          return res.status(500).send(err);
      else{

          founddata.deliverychallanno = req.body.data.deliverychallanno,
          founddata.toaddress = req.body.data.toaddress,
          founddata.site = req.body.data.site,
          founddata.date = req.body.data.date,
          founddata.ponumber = req.body.data.ponumber,
          founddata.podate = req.body.data.podate,
          founddata.vehiclenumber = req.body.data.vehiclenumber,
          founddata.gstno = req.body.data.gstno,
          founddata.otherreference = req.body.data.otherreference,
          founddata.totalvalue = req.body.data.totalvalue,
          founddata.mobilenumber = req.body.data.mobilenumber,
          founddata.addeditemlist = req.body.data.AddedIteminfo
         
          founddata.save(function (err,updateddata) {
              if (err) 
                  res.status(500).send(err);
  
              res.status(200).json({success:{global:"Challan is updated successfully"}})
          })
          
      }  
  })
}

exports.get_SingleChallan = (req, res) => {
  Challan
  .find({'_id':req.params.id})
    .populate(
      'customerid addeditemlist.id addeditemlist.itemuom addeditemlist.itemtype addeditemlist.itemuom',
      '_id masteritemtypename uomname masteritemname masteritemimage masteritemunitwt'
    )
    .exec()
    .then(invoicedata => {
      const response = {
        count: invoicedata.length,
        challandata: invoicedata.map(data => ({
          _id: data.id,
          addeditemlist: data.addeditemlist,
          deliverychallanno: data.deliverychallanno,
          toaddress: data.toaddress,
          site: data.site,
          date: data.date,
          ponumber: data.ponumber,
          podate: data.podate,
          vehiclenumber: data.vehiclenumber,
          gstno: data.gstno,
          mobilenumber: data.mobilenumber,
          otherreference: data.otherreference
        }))
      };
      console.log(response);
      res.status(200).json({ challanlist: response });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: { global: 'something went wrong' } });
    });
};
