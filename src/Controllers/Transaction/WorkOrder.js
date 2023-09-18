import mongoose from 'mongoose';
import async from 'async';
import ParseErrors from '../../utils/ParseErrors';
import WorkOrder from '../../models/workorder';

exports.add_Order = (req, res) => {
  const { data } = req.body;
  const challan = new WorkOrder({
    _id: mongoose.Types.ObjectId(),
    addeditemlist: data.AddedIteminfo,
    workorderno: data.workorderno,
    companydetails: data.companydetails,
    contactperson: data.contactperson,
    quotationnumber: data.quotationnumber,
    quotationid: data.quotationid,
    date: data.date,
    officeno: data.officeno,
    deliveryschedule: data.deliveryschedule,
    orderdate: data.orderdate,
    deliveryaddress: data.deliveryaddress,
    distance: data.distance,
    sitecontactperson: data.sitecontactperson,
    gstno: data.gstno,
    pono: data.pono
  });
  challan
    .save()
    .then(async quotationvalue => {
      const orderdata = await quotationvalue
        .populate(
          'customerid addeditemlist.itemuom addeditemlist.itemtype',
          '_id masteritemtypename uomname'
        )
        .execPopulate();
      res.status(201).json({ orderdata });
    })
    .catch(err => res.status(400).json({ errors: ParseErrors(err.errors) }));
};
exports.get_Order = (req, res) => {
  WorkOrder.find()
    .populate(
      'customerid addeditemlist.id addeditemlist.itemuom addeditemlist.itemtype addeditemlist.itemuom',
      '_id masteritemtypename uomname masteritemname masteritemimage masteritemunitwt'
    )
    .exec()
    .then(invoicedata => {
      const response = {
        count: invoicedata.length,
        orderdata: invoicedata.map(data => ({
          _id: data.id,
          addeditemlist: data.addeditemlist,
          workorderno: data.workorderno,
          companydetails: data.companydetails,
          contactperson: data.contactperson,
          quotationnumber: data.quotationnumber,
          quotationid: data.quotationid,
          date: data.date,
          officeno: data.officeno,
          deliveryschedule: data.deliveryschedule,
          orderdate: data.orderdate,
          deliveryaddress: data.deliveryaddress,
          distance: data.distance,
          sitecontactperson: data.sitecontactperson,
          gstno: data.gstno,
          pono: data.pono,
          completed: data.completed
        }))
      };
      res.status(200).json({ orderlist: response });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: { global: 'something went wrong' } });
    });
};

exports.getorderno = (req,res) => {
  let orderno = 0;
  WorkOrder.find()
  .exec()
  .then((orderdata) => {
      orderno = parseInt(orderdata.length) + 1016;
      res.status(200).json({ orderno: orderno });
  })
  .catch((err) => {
      console.log(err);
      res.status(500).json({ error: { global: "something went wrong" } });
  })
}


exports.get_SingleWorkOrder = (req, res) => {

  WorkOrder
  .find({'_id':req.params.id})
    .populate(
      'customerid addeditemlist.id addeditemlist.itemuom addeditemlist.itemtype addeditemlist.itemuom',
      '_id masteritemtypename uomname masteritemname masteritemimage masteritemunitwt'
    )
    .exec()
    .then(invoicedata => {
      const response = {
        count: invoicedata.length,
        orderdata: invoicedata.map(data => ({
          _id: data.id,
          addeditemlist: data.addeditemlist,
          workorderno: data.workorderno,
          companydetails: data.companydetails,
          contactperson: data.contactperson,
          quotationnumber: data.quotationnumber,
          quotationid: data.quotationid,
          date: data.date,
          officeno: data.officeno,
          deliveryschedule: data.deliveryschedule,
          orderdate: data.orderdate,
          deliveryaddress: data.deliveryaddress,
          distance: data.distance,
          sitecontactperson: data.sitecontactperson,
          gstno: data.gstno,
          pono: data.pono,
          completed: data.completed
        }))
      };
      console.log(response);
      res.status(200).json({ orderlist: response });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: { global: 'something went wrong' } });
    });
};

exports.update_Order = (req,res) => {
  const { data } = req.body;
  WorkOrder.findOne({_id: req.body.data._id}, function (err, founddata) {
      if (err) 
          return res.status(500).send(err);
      else{
        founddata.addeditemlist= req.body.data.AddedIteminfo,
        founddata.workorderno= req.body.data.workorderno,
        founddata.companydetails= req.body.data.companydetails,
        founddata.contactperson= req.body.data.contactperson,
        founddata.date= req.body.data.date,
        founddata.officeno= req.body.data.officeno,
        founddata.quotationnumber = req.body.data.quotationnumber,
        founddata.quotationid = req.body.data.quotationid,
        founddata.deliveryschedule= req.body.data.deliveryschedule,
        founddata.orderdate= req.body.data.orderdate,
        founddata.deliveryaddress= req.body.data.deliveryaddress,
        founddata.distance= req.body.data.distance,
        founddata.sitecontactperson= req.body.data.sitecontactperson,
        founddata.gstno= req.body.data.gstno,
        founddata.pono= req.body.data.pono

        if(req.body.data.completed) {
          founddata.completed = req.body.data.completed;
        }


        founddata.save(function (err,updateddata) {
          if (err) 
          {
            res.status(500).send(err);
          }
          else {
            res.status(200).json({updateddata});
          }
      })
      }
    });

}
