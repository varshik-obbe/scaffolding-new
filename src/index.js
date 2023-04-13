import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import auth from './routes/auth';
import currency from './routes/currency';
import enquiry from './routes/enquiry';
import location from './routes/location';
import material from './routes/material';
import materialType from './routes/materialType';
import product from './routes/product';
import purchaseorder from './routes/purchaseorder';
import customercontact from './routes/Setup/customercontact';
import customerTransaction from './routes/Setup/customerTransaction';
import yearadd from './routes/Setup/yearadd';
import addorupdateitemsinlocation from './routes/Transaction/addorupdateitemsinlocation';
import challan from './routes/Transaction/challan';
import invoice from './routes/Transaction/invoice';
import masterItemList from './routes/Transaction/masterItemList';
import masterItemType from './routes/Transaction/masterItemType';
import moveorder from './routes/Transaction/moveorder';
import order from './routes/Transaction/order';
import production from './routes/Transaction/production';
import proformainvoice from './routes/Transaction/proformainvoice';
import quotation from './routes/Transaction/quotation';
import receiptinfo from './routes/Transaction/Receiptinfo';
import addsuppliercontact from './routes/Transaction/supplierContact';
import addsupplierdetail from './routes/Transaction/supplierDetail';
import unitofmeasure from './routes/unitofmeasure';



dotenv.config();
const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
//mongoose.connect("mongodb://localhost:27017/scaffolding",{ useNewUrlParser: true });
mongoose
  .connect(
//     `mongodb+srv://scaffolding:scaffolding@cluster0-cqgrr.mongodb.net/test?retryWrites=true&w=majority`,
//     { useNewUrlParser: true }
    "mongodb://varshik:test123@localhost:27017/scaffolding?authSource=admin", {useNewUrlParser: true}
  )
//   )
// mongoose.connect("mongodb://localhost:27017/scaffolding",{ useNewUrlParser: true })
  .catch(err => {
    console.log(err);
  });

mongoose.set('useCreateIndex', true);

app.use('/api2/api', auth);
app.use('/api2/unitofmeasure', unitofmeasure);
app.use('/api2/currency', currency);
app.use('/api2/materialtype', materialType);
app.use('/api2/material', material);
app.use('/api2/product', product);
app.use('/api2/transaction', masterItemType);
app.use('/api2/transaction/masterItemList', masterItemList);
app.use('/api2/supplier/suppliercontact', addsuppliercontact);
app.use('/api2/supplier/supplierdetail', addsupplierdetail);
app.use('/api2/location', location);
app.use('/api2/purchaseorder', purchaseorder);
app.use('/api2/addorupdateitemsinlocation', addorupdateitemsinlocation);
app.use('/api2/receiptinfo', receiptinfo);
app.use('/api2/customer', customercontact);
app.use('/api2/year', yearadd);
app.use('/api2/customerTransaction', customerTransaction);
app.use('/api2/Enquiry', enquiry);
app.use('/api2/quotation', quotation);
app.use('/api2/invoice', invoice);
app.use('/api2/proformainvoice', proformainvoice);
app.use('/api2/challan', challan);
app.use('/api2/order', order);
app.use('/api2/production', production);
app.use('/api2/moveorder', moveorder);

//app.use('/react', express.static(path.join(__dirname, './public/index.html')));
app.use('/*', express.static(path.join(__dirname, './public')));
app.listen(502, () => console.log('express-app is running in localhost:502'));
