import mongoose from 'mongoose';
import async from 'async';
import ParseErrors from '../../utils/ParseErrors';
import Production from '../../models/production';

exports.add_Production = (req, res) => {
  let { data } = req.body;
  console.log(data.productionorderno)
  const production = new Production({
    _id: mongoose.Types.ObjectId(),
    customerid: data.customerid,
    productionorderno: data.productionorderno,
    item: data.item,
    quantity: data.quantity,
    date: data.date,
    productiondate: data.productiondate,
    subAssembly: data.subAssembly,
    products: data.products,
    transactionHistrory: []
  });
  production
    .save()
    .then(async quotationvalue => {
      const productiondata = await quotationvalue
        .populate('customerid')
        .execPopulate();
      res.status(201).json({ productiondata });
    })
    .catch(err => res.status(400).json({ errors: ParseErrors(err.errors) }));
};

exports.get_Production = (req, res) => {
  // Production.remove({},function(err,data){
  //   return res.send(200)
  // })
  Production.find()
    .populate(
      'customerid addeditemlist.id addeditemlist.itemuom addeditemlist.itemtype'
    )
    .exec()
    .then(productiondata => {
      console.log(productiondata)
      const response = {
        count: productiondata.length,
        productiondata: productiondata.map(data => ({
          _id: data._id,
          customerid: data.customerid._id,
          customername: data.customerid.customername,
          productionorderno: data.productionorderno,
          item: data.item,
          quantity: data.quantity,
          date: data.date,
          productiondate: data.productiondate,
          subAssembly: data.subAssembly,
          products: data.products,
          transactionHistrory: data.transactionHistrory
        }))
      };
      console.log(response);
      res.status(200).json({ productionlist: response });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: { global: 'something went wrong' } });
    });
}


exports.update_production_qty = (req,res) =>{
    
  Production.findOne({_id: req.body.data._id}, function (err, founddata) {
    //console.log(req.body.transactionHistrory)
      if (err) 
          return res.status(500).send(err);
      else{
        if(req.body.data.transactionHistrory){

          req.body.data.transactionHistrory.filter((item) =>{
              founddata.transactionHistrory.push(item)
          })
        }
        else{
          founddata.transactionHistrory = req.body.data.transactionHistrory;
        }
        console.log(founddata)
        founddata.save(function (err,updateddata) {
            if (err) 
                res.status(500).send(err);

            res.send({
                status  : 200,
                message : 'New transaction updated',
                data : updateddata
            })
        })
          
      }  
  })
}

