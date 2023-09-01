import mongoose from "mongoose";
import fs from "fs";
import ParseErrors from "../../utils/ParseErrors";
import Quotation from "../../models/Quotation";
import Handlebars from "handlebars";
import puppeteer from "puppeteer";
import moment from "moment";
import { promisify } from "util";
import Year from "../../models/year";


let amountinwords = ''

exports.add_Quotation = (req, res) => {
    const { data } = req.body;
    const quotation = new Quotation({
        _id: mongoose.Types.ObjectId(),
        customerid: data.customerdetail.id,
        customernumber: data.customerdetail.customernumber,
        customername: data.customerdetail.customername,
        customercontactnumber: data.customerdetail.customercontactnumber,
        customergstnumber: data.customerdetail.customergstnumber,
        quotationnumber: data.quotationnumber,
        scheduledays: data.scheduledays,
        customeraddress: data.customeraddress,
        date: data.date,
        tax: data.gst,
        tcs: data.tcs,

        tcharge: data.tcharge,

        ws: data.ws,
        user_email: data.user_email,
        loadingcharge: data.loadingcharge,
        weighttons: data.weighttons,
        transportationgst: data.transportationgst,
        subject: data.subject,
        totalvalue: data.totalvalue,
        addeditemlist: data.AddedIteminfo
    })
    quotation.save().then(async (quotationvalue) => {
        const quotationdata = await quotationvalue.populate('customerid addeditemlist.itemuom addeditemlist.itemtype', '_id masteritemtypename uomname').execPopulate();
        res.status(201).json({ quotationdata })
    })
        .catch((err) => res.status(400).json({ errors: ParseErrors(err.errors) }));
}

exports.get_singleQuotation = (req, res) => {
    Quotation
        .find({ '_id': req.params.id })
        .populate('customerid addeditemlist.id addeditemlist.itemuom addeditemlist.itemtype', '_id masteritemtypename uomname masteritemname masteritemimage masteritemunitwt')
        .exec()
        .then(quotationdata => {
            console.log(quotationdata)
            const response = {
                count: quotationdata.length,
                quotationdata: quotationdata.map((quotation) => ({
                    _id: quotation._id,
                    customerid: quotation.customerid._id,
                    customernumber: quotation.customernumber,
                    customername: quotation.customername,
                    customeraddress: quotation.customeraddress ? quotation.customeraddress : '',
                    customercontactnumber: quotation.customercontactnumber,
                    customergstnumber: quotation.customergstnumber,
                    quotationnumber: quotation.quotationnumber,
                    date: quotation.date,
                    scheduledays: quotation.scheduledays,
                    tax: quotation.tax,
                    tcs: quotation.tcs,
                    tcharge: quotation.tcharge,
                    user_email: quotation.user_email,
                    transportationgst: quotation.transportationgst,
                    ws: quotation.ws,
                    loadingcharge: quotation.loadingcharge,
                    weighttons: quotation.weighttons,
                    subject: quotation.subject,
                    totalvalue: quotation.totalvalue,
                    addeditemlist: quotation.addeditemlist
                }))
            }
            console.log(response);

            res.status(200).json({ quotationlist: response });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: { global: "something went wrong" } });
        })
}

exports.get_Quotation = (req, res) => {
    Quotation
        .find()
        .populate('customerid addeditemlist.id addeditemlist.itemuom addeditemlist.itemtype', '_id masteritemtypename uomname masteritemname masteritemimage masteritemunitwt')
        .exec()
        .then(quotationdata => {
            console.log(quotationdata)
            const response = {
                count: quotationdata.length,
                quotationdata: quotationdata.map((quotation) => ({
                    _id: quotation._id,
                    customerid: quotation.customerid._id,
                    customernumber: quotation.customernumber,
                    customername: quotation.customername,
                    customercontactnumber: quotation.customercontactnumber,
                    customergstnumber: quotation.customergstnumber,
                    quotationnumber: quotation.quotationnumber,
                    customeraddress: quotation.customeraddress ? quotation.customeraddress : '',
                    date: quotation.date,
                    scheduledays: quotation.scheduledays,
                    tax: quotation.tax,
                    tcs: quotation.tcs,
                    user_email: quotation.user_email,
                    tcharge: quotation.tcharge,
                    transportationgst: quotation.transportationgst,
                    ws: quotation.ws,
                    loadingcharge: quotation.loadingcharge,
                    weighttons: quotation.weighttons,
                    subject: quotation.subject,
                    totalvalue: quotation.totalvalue,
                    addeditemlist: quotation.addeditemlist
                }))
            }
            console.log(response);
            res.status(200).json({ quotationlist: response });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: { global: "something went wrong" } });
        })
}


exports.update_quotation = (req, res) => {

    Quotation.findOne({ _id: req.body.data._id }, function (err, founddata) {
        if (err)
            return res.status(500).send(err);
        else {

            founddata.customerid = req.body.data.customerdetail.id,
                founddata.customernumber = req.body.data.customerdetail.customernumber,
                founddata.customername = req.body.data.customerdetail.customername,
                founddata.customercontactnumber = req.body.data.customerdetail.customercontactnumber,
                founddata.customergstnumber = req.body.data.customerdetail.customergstnumber,
                founddata.quotationnumber = req.body.data.quotationnumber,
                founddata.date = req.body.data.date,
                founddata.scheduledays = req.body.data.scheduledays,
                founddata.tax = req.body.data.gst,
                founddata.tcs = req.body.data.tcs,
                founddata.subject = req.body.data.subject,
                founddata.user_email = req.body.data.user_email,
                founddata.totalvalue = req.body.data.totalvalue,
                founddata.customeraddress = req.body.data.customeraddress,
                founddata.addeditemlist = req.body.data.AddedIteminfo
            founddata.tcharge = req.body.data.tcharge,
                founddata.transportationgst = req.body.data.transportationgst,
                founddata.ws = req.body.data.ws,
                founddata.loadingcharge = req.body.data.loadingcharge,
                founddata.weighttons = req.body.data.weighttons


            founddata.save(function (err, updateddata) {
                if (err)
                {
                    res.status(500).send(err);
                }
                else {
                    res.status(200).json({ success: { global: "Quotation is updated successfully" } })
                }
            })

        }
    })
}

exports.getquotno = (req,res) => {
    let quoteno = 0;
    Quotation.find()
    .exec()
    .then((quotationdata) => {
        quoteno = parseInt(quotationdata.length) + 17816;
        res.status(200).json({ quoteno: quoteno });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ error: { global: "something went wrong" } });
    })
}

function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }));
}

async function toBase64(filePath) {
    try {
      const readFile = promisify(fs.readFile);
      const result = await readFile(filePath, {
        encoding: 'base64',
      });
  
      return result;
    } catch (err) {
      console.log(err);
    }
}

let Rs = function (amount) {
    var words = new Array();
    words[0] = 'Zero'; words[1] = 'One'; words[2] = 'Two'; words[3] = 'Three'; words[4] = 'Four'; words[5] = 'Five'; words[6] = 'Six'; words[7] = 'Seven'; words[8] = 'Eight'; words[9] = 'Nine'; words[10] = 'Ten'; words[11] = 'Eleven'; words[12] = 'Twelve'; words[13] = 'Thirteen'; words[14] = 'Fourteen'; words[15] = 'Fifteen'; words[16] = 'Sixteen'; words[17] = 'Seventeen'; words[18] = 'Eighteen'; words[19] = 'Nineteen'; words[20] = 'Twenty'; words[30] = 'Thirty'; words[40] = 'Forty'; words[50] = 'Fifty'; words[60] = 'Sixty'; words[70] = 'Seventy'; words[80] = 'Eighty'; words[90] = 'Ninety'; var op;
    amount = amount.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
    if (n_length <= 9) {
      var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
      var received_n_array = new Array();
      for (var i = 0; i < n_length; i++) {
        received_n_array[i] = number.substr(i, 1);
      }
      for (var i = 9 - n_length, j = 0; i < 9; i++ , j++) {
        n_array[i] = received_n_array[j];
      }
      for (var i = 0, j = 1; i < 9; i++ , j++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          if (n_array[i] == 1) {
            n_array[j] = 10 + parseInt(n_array[j]);
            n_array[i] = 0;
          }
        }
      }
      var value = "";
      for (var i = 0; i < 9; i++) {
        if (i == 0 || i == 2 || i == 4 || i == 7) {
          value = n_array[i] * 10;
        } else {
          value = n_array[i];
        }
        if (value != 0) {
          words_string += words[value] + " ";
        }
        if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Crores ";
        }
        if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Lakhs ";
        }
        if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
          words_string += "Thousand ";
        }
        if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
          words_string += "Hundred and ";
        } else if (i == 6 && value != 0) {
          words_string += "Hundred ";
        }
      }
      words_string = words_string.split(" ").join(" ");
    }
    return words_string;
  }

let RsPaise = function (n) {
    var op;
    var nums = n.toString().split('.')
    var whole = Rs(nums[0])
    if (nums[1] == null) nums[1] = 0;
    if (nums[1].length == 1) nums[1] = nums[1] + '0';
    if (nums[1].length > 2) { nums[1] = nums[1].substring(2, nums[1].length - 1) }
    if (nums.length == 2) {
      if (nums[0] <= 9) { nums[0] = nums[0] * 10 } else { nums[0] = nums[0] };
      var fraction = Rs(nums[1])
      if (whole == '' && fraction == '') { op = 'Zero only'; }
      if (whole == '' && fraction != '') { op = 'paise ' + fraction + ' only'; }
      if (whole != '' && fraction == '') { op = 'INR: ' + whole + ' only'; }
      if (whole != '' && fraction != '') { op = 'INR: ' + whole + 'and ' + fraction + ' paise only'; }
      amountinwords = op
    }
  }

exports.generate_pdf = (req, res) => {
    Quotation.find({ _id: req.params.id })
        .populate('customerid addeditemlist.id addeditemlist.itemuom addeditemlist.itemtype', '_id masteritemtypename uomname masteritemname masteritemimage masteritemunitwt')
        .exec()
        .then(async quotationdata => {

            let year = await Year.findOne().exec().then(
                (yeardata) => {
                    if (yeardata) {
                        return yeardata.currentyear;
                    }
                    else {
                        return "2020-21";
                    }
                },
                (error) => {
                    return "2020-21";
                }
            )
                .catch(err => {
                    return "2023-24";
                })

            console.log(quotationdata);

            let quoteNo = "PSPL/Quote/" + quotationdata[0].quotationnumber + "/" + year;

            let requestdeliverydate = moment(
                quotationdata[0].date
              ).format("DD MMM, YYYY");

            let customergst = quotationdata[0].customergstnumber ? quotationdata[0].customergstnumber : "";

            let customername = quotationdata[0].customername;

            let customernumber = quotationdata[0].customercontactnumber;

            let ws = quotationdata[0].ws;

            let address = quotationdata[0].customeraddress;

            let weightintons = quotationdata[0].weighttons;

            let loadingandhandling = quotationdata[0].loadingcharge;

            let gst = quotationdata[0].tax;

            let scheduledays = quotationdata[0].scheduledays ? quotationdata[0].scheduledays + ' days' : '8-10 days';


            const readFile = promisify(fs.readFile);

            let html = await readFile("./uploads/newOptimizedinvoice.html", 'utf-8');

            Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
                return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
            });

            Handlebars.registerHelper("inc", function(value, options)
            {
                return parseInt(value) + 1;
            });

            let template = Handlebars.compile(html);

            let transportcharges;
            let transportchargesGST;
            transportcharges = quotationdata[0].tcharge ? quotationdata[0].tcharge : 0;
            let tcs  = quotationdata[0].tcs ? quotationdata[0].tcs : 0;
            transportchargesGST = quotationdata[0].transportationgst ? quotationdata[0].transportationgst : 0;
            let transportGSTAmount = parseFloat(transportcharges) * parseFloat(transportchargesGST) / 100;
            let tcsamount;
            transportGSTAmount = transportGSTAmount.toFixed(2);
            let pageoneislast = false;
            let pagetwoislast = false;
            let pagethreeislast = false;
            let pagefourislast = false;
            let totalAllPages = 0;
            let totalSubTotalPages = 0;
            let totalGstAllPages = 0;
            let totalGSTTotalAllpages = 0;
            let pageone = [];
            let pageTwo = [];
            let pageThree = [];
            let pageFour = [];
            let pageOneData = [];
            let pageOneImgs = [];
            let pageOneBigImgs = [];
            let pageTwoImgs = [];
            let pageTwoBigImgs = [];
            let pageThreeImgs = [];
            let pageThreeBigImgs = [];
            let pageFourImgs = [];
            let pageFourBigImgs = [];
            let pageoneRowspan = 0;
            let pagetwoRowspan = 0;
            let pagethreeRowspan = 0;
            let pageonetotal = 0;
            let pagetwototal = 0;
            let pagethreetotal = 0;
            let pagefourtotal = 0;
            let pageonesubtotal = 0;
            let pagetwosubtotal = 0;
            let pagethreesubtotal = 0;
            let pagefoursubtotal = 0;
            let pageonegst = 0;
            let pagetwogst = 0;
            let pagethreegst = 0;
            let pagefourgst = 0;
            let pageonegsttotal = 0;
            let pagetwogsttotal = 0;
            let pagethreegsttotal = 0;
            let pagefourgsttotal = 0;
            let pageTwoData = [];
            let pageThreeData = [];
            let pageFourData = [];
            let totalLength = 0;
            let noOfPages = 1;
            if (quotationdata[0].addeditemlist.length > 0) {
                quotationdata[0].addeditemlist.map((itemlist, i) => {
                    if (itemlist.itemdiscountamount != '0.00' && itemlist.itemdiscountamount != 'NaN' && itemlist.itemdiscountamount != null) {
                        quotationdata[0].addeditemlist[i].itemdiscountamount = parseFloat(itemlist.itemdiscountamount)
                        quotationdata[0].addeditemlist[i].itemdiscountamount = quotationdata[0].addeditemlist[i].itemdiscountamount.toFixed(2)
                    }
                    else {
                        quotationdata[0].addeditemlist[i].itemdiscountamount = '0.00'
                    }
                    quotationdata[0].addeditemlist[i].quantity = parseInt(itemlist.quantity)

                    if (itemlist.itemdiscountamount != '0.00' && itemlist.itemdiscountamount != 'NaN' && itemlist.itemdiscountamount != null) {
                        quotationdata[0].addeditemlist[i].totalcost = parseFloat(itemlist.itemdiscountamount) * parseInt(itemlist.quantity);
                    }
                    else {
                        quotationdata[0].addeditemlist[i].totalcost = parseFloat(itemlist.costperunit) * parseInt(itemlist.quantity);
                    }

                    quotationdata[0].addeditemlist[i].totalcost = parseFloat(quotationdata[0].addeditemlist[i].totalcost)
                    quotationdata[0].addeditemlist[i].totalcost = quotationdata[0].addeditemlist[i].totalcost.toFixed(2)

                    if (itemlist.itemdiscountamount == '0.00' || itemlist.itemdiscountamount == 'NaN' || itemlist.itemdiscountamount == null) {
                        quotationdata[0].addeditemlist[i].itemdiscountamount = "0";
                    }
                })

                quotationdata[0].addeditemlist.forEach((ele, i) => {
                    if (i == 0 && quotationdata[0].addeditemlist.length > 1) {
                        if(ele.itemdescription.length < 1020) {
                            pageone.push(i);
                            pageOneImgs.push(encodeURI(quotationdata[0].addeditemlist[i].itemimage))
                            pageOneBigImgs.push(encodeURI(quotationdata[0].addeditemlist[i].itemsecondimage))
                            if (ele.itemdescription.length + quotationdata[0].addeditemlist[i + 1].itemdescription.length < 1020) {
                                pageone.push(i + 1);
                                pageOneImgs.push(encodeURI(quotationdata[0].addeditemlist[i + 1].itemimage))
                                pageOneBigImgs.push(encodeURI(quotationdata[0].addeditemlist[i + 1].itemsecondimage))
                                if (quotationdata[0].addeditemlist.length > 2) {
                                    if (ele.itemdescription.length + quotationdata[0].addeditemlist[i + 1].itemdescription.length + quotationdata[0].addeditemlist[i + 2].itemdescription.length < 1020) {
                                        pageone.push(i + 2);
                                        pageOneImgs.push(encodeURI(quotationdata[0].addeditemlist[i + 2].itemimage))
                                        pageOneBigImgs.push(encodeURI(quotationdata[0].addeditemlist[i + 2].itemsecondimage))
                                        if (quotationdata[0].addeditemlist.length > 3) {
                                            if (ele.itemdescription.length + quotationdata[0].addeditemlist[i + 1].itemdescription.length + quotationdata[0].addeditemlist[i + 2].itemdescription.length + quotationdata[0].addeditemlist[i + 3].itemdescription.length < 1020) {
                                                pageone.push(i + 3);
                                                pageOneImgs.push(quotationdata[0].addeditemlist[i + 3].itemimage)
                                                pageOneBigImgs.push(quotationdata[0].addeditemlist[i + 3].itemsecondimage)
                                                if (quotationdata[0].addeditemlist.length > 4) {
                                                    if (ele.itemdescription.length + quotationdata[0].addeditemlist[i + 1].itemdescription.length + quotationdata[0].addeditemlist[i + 2].itemdescription.length + quotationdata[0].addeditemlist[i + 3].itemdescription.length + quotationdata[0].addeditemlist[i + 4].itemdescription.length < 1020) {
                                                        pageone.push(i + 4);
                                                        pageOneImgs.push(quotationdata[0].addeditemlist[i + 4].itemimage)
                                                        pageOneBigImgs.push(quotationdata[0].addeditemlist[i + 4].itemsecondimage)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (pageone.length > 0) {
                            if (quotationdata[0].addeditemlist.length > pageone.length) {
                                if (quotationdata[0].addeditemlist[pageone.length].itemdescription.length < 1360) {
                                    pageTwo.push(pageone.length)
                                    pageTwoImgs.push(quotationdata[0].addeditemlist[pageone.length].itemimage)
                                    pageTwoBigImgs.push(quotationdata[0].addeditemlist[pageone.length].itemsecondimage)
                                }
                                if(quotationdata[0].addeditemlist.length > (pageone.length + 1) && quotationdata[0].addeditemlist[pageone.length].itemdescription.length + quotationdata[0].addeditemlist[pageone.length + 1].itemdescription.length < 1360) {
                                    pageTwo.push(pageone.length + 1)
                                    pageTwoImgs.push(quotationdata[0].addeditemlist[pageone.length + 1].itemimage)
                                    pageTwoBigImgs.push(quotationdata[0].addeditemlist[pageone.length + 1].itemsecondimage)
                                }
                                if(quotationdata[0].addeditemlist.length > (pageone.length + 2) && quotationdata[0].addeditemlist[pageone.length].itemdescription.length + quotationdata[0].addeditemlist[pageone.length + 1].itemdescription.length + quotationdata[0].addeditemlist[pageone.length + 2].itemdescription.length < 1360) {
                                    pageTwo.push(pageone.length + 2)
                                    pageTwoImgs.push(quotationdata[0].addeditemlist[pageone.length + 2].itemimage)
                                    pageTwoBigImgs.push(quotationdata[0].addeditemlist[pageone.length + 2].itemsecondimage)
                                }
                                if(quotationdata[0].addeditemlist.length > (pageone.length + 3) && quotationdata[0].addeditemlist[pageone.length].itemdescription.length + quotationdata[0].addeditemlist[pageone.length + 1].itemdescription.length + quotationdata[0].addeditemlist[pageone.length + 2].itemdescription.length + quotationdata[0].addeditemlist[pageone.length + 3].itemdescription.length < 1360) {
                                    pageTwo.push(pageone.length + 3)
                                    pageTwoImgs.push(quotationdata[0].addeditemlist[pageone.length + 3].itemimage)
                                    pageTwoBigImgs.push(quotationdata[0].addeditemlist[pageone.length + 3].itemsecondimage)
                                }
                            }
                        }
                        if(pageTwo.length > 0) {
                            if (quotationdata[0].addeditemlist.length > (pageone.length + pageTwo.length)) {
                                if (quotationdata[0].addeditemlist[pageone.length + pageTwo.length].itemdescription.length < 1100) {
                                    pageThree.push(pageone.length  + pageTwo.length)
                                    pageThreeImgs.push(quotationdata[0].addeditemlist[pageone.length  + pageTwo.length].itemimage)
                                    pageThreeBigImgs.push(quotationdata[0].addeditemlist[pageone.length  + pageTwo.length].itemsecondimage)
                                }
                                if(quotationdata[0].addeditemlist.length > (pageone.length  + pageTwo.length + 1) && quotationdata[0].addeditemlist[pageone.length  + pageTwo.length].itemdescription.length + quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + 1].itemdescription.length < 1100) {
                                    pageThree.push(pageone.length  + pageTwo.length + 1)
                                    pageThreeImgs.push(quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + 1].itemimage)
                                    pageThreeBigImgs.push(quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + 1].itemsecondimage)
                                }
                                if(quotationdata[0].addeditemlist.length > (pageone.length  + pageTwo.length + 2) && quotationdata[0].addeditemlist[pageone.length  + pageTwo.length].itemdescription.length + quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + 1].itemdescription.length + quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + 2].itemdescription.length < 1100) {
                                    pageThree.push(pageone.length  + pageTwo.length + 2)
                                    pageThreeImgs.push(quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + 2].itemimage)
                                    pageThreeBigImgs.push(quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + 2].itemsecondimage)
                                }
                                if(quotationdata[0].addeditemlist.length > (pageone.length  + pageTwo.length + 3) && quotationdata[0].addeditemlist[pageone.length  + pageTwo.length].itemdescription.length + quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + 1].itemdescription.length + quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + 2].itemdescription.length + quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + 3].itemdescription.length < 1100) {
                                    pageThree.push(pageone.length  + pageTwo.length + 3)
                                    pageThreeImgs.push(quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + 3].itemimage)
                                    pageThreeBigImgs.push(quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + 3].itemsecondimage)
                                }
                            }
                        }
                        if(pageThree.length > 0) {
                            if (quotationdata[0].addeditemlist.length > (pageone.length + pageTwo.length + pageThree.length)) {
                                if (quotationdata[0].addeditemlist[pageone.length + pageTwo.length + pageThree.length].itemdescription.length < 1100) {
                                    pageFour.push(pageone.length  + pageTwo.length + pageThree.length)
                                    pageFourImgs.push(quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + pageThree.length].itemimage)
                                    pageFourBigImgs.push(quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + pageThree.length].itemsecondimage)
                                }
                                if(quotationdata[0].addeditemlist.length > (pageone.length  + pageTwo.length + pageThree.length + 1) && quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + pageThree.length].itemdescription.length + quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + pageThree.length + 1].itemdescription.length < 1100) {
                                    pageFour.push(pageone.length  + pageTwo.length + pageThree.length + 1)
                                    pageFourImgs.push(quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + pageThree.length + 1].itemimage)
                                    pageFourBigImgs.push(quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + pageThree.length + 1].itemsecondimage)
                                }
                                if(quotationdata[0].addeditemlist.length > (pageone.length  + pageTwo.length + pageThree.length + 2) && quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + pageThree.length].itemdescription.length + quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + pageThree.length + 1].itemdescription.length + quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + pageThree.length + 2].itemdescription.length < 1100) {
                                    pageFour.push(pageone.length  + pageTwo.length + pageThree.length + 2)
                                    pageFourImgs.push(quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + pageThree.length + 2].itemimage)
                                    pageFourBigImgs.push(quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + pageThree.length + 2].itemsecondimage)
                                }
                                if(quotationdata[0].addeditemlist.length > (pageone.length  + pageTwo.length + pageThree.length + 3) && quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + pageThree.length].itemdescription.length + quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + pageThree.length + 1].itemdescription.length + quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + pageThree.length + 2].itemdescription.length + quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + pageThree.length + 3].itemdescription.length < 1100) {
                                    pageFour.push(pageone.length  + pageTwo.length + pageThree.length + 3)
                                    pageFourImgs.push(quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + pageThree.length + 3].itemimage)
                                    pageFourBigImgs.push(quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + pageThree.length + 3].itemsecondimage)
                                }
                            }
                        }
                    }
                    else if((i == 0 && quotationdata[0].addeditemlist.length == 1)) {
                        pageone.push(i);
                        pageOneImgs.push(encodeURI(quotationdata[0].addeditemlist[i].itemimage))
                        pageOneBigImgs.push(encodeURI(quotationdata[0].addeditemlist[i].itemsecondimage))
                    }
                });

                if (pageone.length > 0) {
                    pageone.forEach((element, index) => {
                        let data =  {
                            id: quotationdata[0].addeditemlist[element].id,
                            itemname: quotationdata[0].addeditemlist[element].itemname,
                            itemimage: quotationdata[0].addeditemlist[element].itemimage,
                            itemdescription: quotationdata[0].addeditemlist[element].itemdescription,
                            itemshortdescription: quotationdata[0].addeditemlist[element].itemshortdescription,
                            itemtype: quotationdata[0].addeditemlist[element].itemtype,
                            itemuom: quotationdata[0].addeditemlist[element].itemuom,
                            costperunit: quotationdata[0].addeditemlist[element].costperunit,
                            itemdiscount: quotationdata[0].addeditemlist[element].itemdiscount,
                            itemdiscountamount: quotationdata[0].addeditemlist[element].itemdiscountamount,
                            quantity: quotationdata[0].addeditemlist[element].quantity,
                            totalcost: quotationdata[0].addeditemlist[element].totalcost
                        }
                        pageonetotal  = pageonetotal + parseFloat(quotationdata[0].addeditemlist[element].totalcost);
                        if(pageone.length > 2) {
                        data["pageOneImgs"] = pageOneImgs[index];
                        data["pageOneHeight"] = 60;
                        }
                        else {
                        data["pageOneBigImgs"] = pageOneBigImgs[index];
                        data["pageOneHeight"] = 120;
                        }
                        data["pageoneRowspan"] = pageone.length;
                        if(index == 0) {
                            data["pageoneFirstImage"] = pageOneImgs[0];
                        }
                        if(index == 1) {
                            data["pageoneSecondImage"] = pageOneImgs[1];
                        }
                        if(index == 3) {
                            data["pageoneThirdImage"] = pageOneImgs[2];
                        }
                        if(index == 4) {
                            data["pageoneFourthImage"] = pageOneImgs[3];
                        }
                        if(index == 5) {
                            data["pageoneFifthImage"] = pageOneImgs[4];
                        }
                        pageOneData.push(data);
                    });
                    pageonesubtotal = parseFloat(ws) + parseFloat(pageonetotal) + parseFloat(loadingandhandling);
                    totalAllPages = pageonetotal;
                    totalSubTotalPages = pageonesubtotal;
                    pageonegst = parseFloat(pageonesubtotal) * (parseFloat(quotationdata[0].tax) / 100);
                    totalGstAllPages = pageonegst;
                    tcsamount = parseFloat(pageonesubtotal) * parseFloat(tcs) / 100;
                    pageonegsttotal = pageonegst + pageonesubtotal + parseFloat(transportGSTAmount) + parseFloat(transportcharges) + tcsamount;
                    totalGSTTotalAllpages = pageonegsttotal;
                    totalSubTotalPages = totalSubTotalPages.toFixed(2);
                    totalGstAllPages = totalGstAllPages.toFixed(2);
                    totalGSTTotalAllpages = totalGSTTotalAllpages.toFixed(2);
                    totalAllPages = totalAllPages.toFixed(2);
                    pageonesubtotal = pageonesubtotal.toFixed(2);
                    tcsamount = tcsamount.toFixed(2);
                    pageonetotal = pageonetotal.toFixed(2);
                    pageonegst = pageonegst.toFixed(2);
                    pageonegsttotal = pageonegsttotal.toFixed(2);
                    pageoneislast = true;
                    RsPaise(pageonegsttotal);
                }
                if (pageTwo.length > 0) {
                    pageTwo.forEach((element, index) => {
                        let data =  {
                            id: quotationdata[0].addeditemlist[element].id,
                            itemname: quotationdata[0].addeditemlist[element].itemname,
                            itemimage: quotationdata[0].addeditemlist[element].itemimage,
                            itemdescription: quotationdata[0].addeditemlist[element].itemdescription,
                            itemshortdescription: quotationdata[0].addeditemlist[element].itemshortdescription,
                            itemtype: quotationdata[0].addeditemlist[element].itemtype,
                            itemuom: quotationdata[0].addeditemlist[element].itemuom,
                            costperunit: quotationdata[0].addeditemlist[element].costperunit,
                            itemdiscount: quotationdata[0].addeditemlist[element].itemdiscount,
                            itemdiscountamount: quotationdata[0].addeditemlist[element].itemdiscountamount,
                            quantity: quotationdata[0].addeditemlist[element].quantity,
                            totalcost: quotationdata[0].addeditemlist[element].totalcost
                        }
                        pagetwototal  = pagetwototal + parseFloat(quotationdata[0].addeditemlist[element].totalcost);
                        if(pageTwo.length > 2) {
                            data["pageTwoImgs"] = pageTwoImgs[index];
                            data["pageTwoHeight"] = 60;
                        }
                        else {
                            data["pageTwoBigImgs"] = pageTwoBigImgs[index];
                            data["pageTwoHeight"] = 120;
                        }
                        data["pagetwoRowspan"] = pageTwo.length;
                        pageTwoData.push(data);
                    });
                    let allpagesTotal = parseFloat(pagetwototal) + parseFloat(pageonetotal);
                    totalAllPages = allpagesTotal;
                    pagetwosubtotal = parseFloat(ws) + parseFloat(allpagesTotal) + parseFloat(loadingandhandling);
                    totalSubTotalPages = pagetwosubtotal;
                    pagetwogst = parseFloat(pagetwosubtotal) * (parseFloat(quotationdata[0].tax) / 100);
                    totalGstAllPages = pagetwogst;
                    tcsamount = parseFloat(pagetwosubtotal) * parseFloat(tcs) / 100;
                    pagetwogsttotal = pagetwogst + pagetwosubtotal + parseFloat(transportGSTAmount) + parseFloat(transportcharges) + tcsamount;
                    totalGSTTotalAllpages = pagetwogsttotal;
                    totalSubTotalPages = totalSubTotalPages.toFixed(2);
                    totalGstAllPages = totalGstAllPages.toFixed(2);
                    totalGSTTotalAllpages = totalGSTTotalAllpages.toFixed(2);
                    totalAllPages = totalAllPages.toFixed(2);
                    pagetwosubtotal = pagetwosubtotal.toFixed(2);
                    tcsamount = tcsamount.toFixed(2);
                    pagetwototal = pagetwototal.toFixed(2);
                    pagetwogst = pagetwogst.toFixed(2);
                    pagetwogsttotal = pagetwogsttotal.toFixed(2);
                    pageoneislast = false;
                    pagetwoislast = true;
                    RsPaise(pagetwogsttotal);
                }
                if (pageThree.length > 0) {
                    pageThree.forEach((element, index) => {
                        let data =  {
                            id: quotationdata[0].addeditemlist[element].id,
                            itemname: quotationdata[0].addeditemlist[element].itemname,
                            itemimage: quotationdata[0].addeditemlist[element].itemimage,
                            itemdescription: quotationdata[0].addeditemlist[element].itemdescription,
                            itemshortdescription: quotationdata[0].addeditemlist[element].itemshortdescription,
                            itemtype: quotationdata[0].addeditemlist[element].itemtype,
                            itemuom: quotationdata[0].addeditemlist[element].itemuom,
                            costperunit: quotationdata[0].addeditemlist[element].costperunit,
                            itemdiscount: quotationdata[0].addeditemlist[element].itemdiscount,
                            itemdiscountamount: quotationdata[0].addeditemlist[element].itemdiscountamount,
                            quantity: quotationdata[0].addeditemlist[element].quantity,
                            totalcost: quotationdata[0].addeditemlist[element].totalcost
                        }
                        pagethreetotal  = pagethreetotal + parseFloat(quotationdata[0].addeditemlist[element].totalcost);
                        if(pageThree.length > 2) {
                            data["pageThreeImgs"] = pageThreeImgs[index];
                            data["pageThreeHeight"] = 60;
                        }
                        else {
                            data["pageThreeBigImgs"] = pageThreeBigImgs[index];
                            data["pageThreeHeight"] = 120;
                        }
                        data["pagethreeRowspan"] = pageThree.length;
                        pageThreeData.push(data);
                    });
                    let allpagesTotal = parseFloat(pagethreetotal) + parseFloat(pagetwototal) + parseFloat(pageonetotal);
                    totalAllPages = allpagesTotal;
                    pagethreesubtotal = parseFloat(ws) + parseFloat(allpagesTotal) + parseFloat(loadingandhandling);
                    totalSubTotalPages = pagethreesubtotal;
                    pagethreegst = parseFloat(pagethreesubtotal) * (parseFloat(quotationdata[0].tax) / 100);
                    totalGstAllPages = pagethreegst;
                    tcsamount = parseFloat(pagethreesubtotal) * parseFloat(tcs) / 100;
                    pagethreegsttotal = pagethreegst + pagethreesubtotal + parseFloat(transportGSTAmount) + parseFloat(transportcharges) + tcsamount;
                    totalGSTTotalAllpages = pagethreegsttotal;
                    totalSubTotalPages = totalSubTotalPages.toFixed(2);
                    totalGstAllPages = totalGstAllPages.toFixed(2);
                    totalGSTTotalAllpages = totalGSTTotalAllpages.toFixed(2);
                    totalAllPages = totalAllPages.toFixed(2);
                    pagethreesubtotal = pagethreesubtotal.toFixed(2);
                    pagethreetotal = pagethreetotal.toFixed(2);
                    tcsamount = tcsamount.toFixed(2);
                    pagethreegst = pagethreegst.toFixed(2);
                    pagethreegsttotal = pagethreegsttotal.toFixed(2);
                    pagetwoislast = false;
                    pagethreeislast = true;
                    RsPaise(pagethreegsttotal);
                }
                if (pageFour.length > 0) {
                    pageFour.forEach((element, index) => {
                        let data =  {
                            id: quotationdata[0].addeditemlist[element].id,
                            itemname: quotationdata[0].addeditemlist[element].itemname,
                            itemimage: quotationdata[0].addeditemlist[element].itemimage,
                            itemdescription: quotationdata[0].addeditemlist[element].itemdescription,
                            itemshortdescription: quotationdata[0].addeditemlist[element].itemshortdescription,
                            itemtype: quotationdata[0].addeditemlist[element].itemtype,
                            itemuom: quotationdata[0].addeditemlist[element].itemuom,
                            costperunit: quotationdata[0].addeditemlist[element].costperunit,
                            itemdiscount: quotationdata[0].addeditemlist[element].itemdiscount,
                            itemdiscountamount: quotationdata[0].addeditemlist[element].itemdiscountamount,
                            quantity: quotationdata[0].addeditemlist[element].quantity,
                            totalcost: quotationdata[0].addeditemlist[element].totalcost
                        }
                        pagefourtotal  = pagefourtotal + parseFloat(quotationdata[0].addeditemlist[element].totalcost);
                        if(pageFour.length > 2) {
                            data["pageFourImgs"] = pageFourImgs[index];
                            data["pageFourHeight"] = 60;
                        }
                        else {
                            data["pageFourBigImgs"] = pageFourBigImgs[index];
                            data["pageFourHeight"] = 120;
                        }
                        data["pageFourRowspan"] = pageFour.length;
                        pageFourData.push(data);
                    });
                    let allpagesTotal = parseFloat(pagefourtotal) + parseFloat(pagethreetotal) + parseFloat(pagetwototal) + parseFloat(pageonetotal);
                    totalAllPages = allpagesTotal;
                    pagefoursubtotal = parseFloat(ws) + parseFloat(allpagesTotal) + parseFloat(loadingandhandling);
                    totalSubTotalPages = pagefoursubtotal;
                    pagefourgst = parseFloat(pagefoursubtotal) * (parseFloat(quotationdata[0].tax) / 100);
                    totalGstAllPages = pagefourgst;
                    tcsamount = parseFloat(pagefoursubtotal) * parseFloat(tcs) / 100;
                    pagefourgsttotal = pagefourgst + pagefoursubtotal + parseFloat(transportGSTAmount) + parseFloat(transportcharges) + tcsamount;
                    totalGSTTotalAllpages = pagefourgsttotal;
                    totalSubTotalPages = totalSubTotalPages.toFixed(2);
                    totalGstAllPages = totalGstAllPages.toFixed(2);
                    totalGSTTotalAllpages = totalGSTTotalAllpages.toFixed(2);
                    totalAllPages = totalAllPages.toFixed(2);
                    pagefoursubtotal = pagefoursubtotal.toFixed(2);
                    pagefourtotal = pagefourtotal.toFixed(2);
                    tcsamount = tcsamount.toFixed(2);
                    pagefourgst = pagefourgst.toFixed(2);
                    pagefourgsttotal = pagefourgsttotal.toFixed(2);
                    pagethreeislast = false;
                    pagefourislast = true;
                    RsPaise(pagefourgsttotal);
                }                                
            }
            else {
                res.status(500).json({ error: { global: "something went wrong", err } });
                return;
            }

            let base_url = process.env.BASE_URL+"uploads/";

            let data = {
                quoteNo: quoteNo,
                pageOneData: pageOneData,
                pageOneImgs: pageOneImgs,
                pageTwoData: pageTwoData,
                pageTwoImgs: pageTwoImgs,
                pageThreeData: pageThreeData,
                pageThreeImgs: pageThreeImgs,
                pageFourData: pageFourData,                
                pageFourImgs: pageFourImgs,                
                base_url: base_url,
                customername: customername,
                customernumber: customernumber,
                ws: ws,
                weightintons: weightintons,
                gst: gst,
                pageonetotal: pageonetotal,
                pageonegst: pageonegst,
                pageonegsttotal: pageonegsttotal,
                pagetwototal: pagetwototal,
                pagetwogst: pagetwogst,
                pagetwogsttotal: pagetwogsttotal,
                pagethreetotal: pagethreetotal,
                pagethreegst: pagethreegst,
                pagethreegsttotal: pagethreegsttotal,
                pagefourtotal: pagefourtotal,
                pagefourgst: pagefourgst,
                pagefourgsttotal: pagefourgsttotal,
                pageonesubtotal: pageonesubtotal,
                pagetwosubtotal: pagetwosubtotal,
                pagethreesubtotal: pagethreesubtotal,
                pagefoursubtotal: pagefoursubtotal,
                loadingandhandling: loadingandhandling,
                pageoneislast: pageoneislast,
                pagetwoislast: pagetwoislast,
                requestdeliverydate: requestdeliverydate,
                amountinwords: amountinwords,
                pagethreeislast: pagethreeislast,
                pagefourislast: pagefourislast,
                customeraddress: address,
                transportGSTAmount: transportGSTAmount,
                transportcharges: transportcharges,
                tcs: tcs,
                customergst: customergst,
                scheduledays: scheduledays,
                tcsamount: tcsamount,
                transportchargesGST: transportchargesGST,
                totalSubTotalPages: totalSubTotalPages,
                totalGstAllPages: totalGstAllPages,
                totalGSTTotalAllpages: totalGSTTotalAllpages,
                totalAllPages: totalAllPages
            }

            let htmlToSend = template(data);

            let pdfName = quotationdata[0].customername.replace(/\//g, "_");
            pdfName = pdfName.replace(/ |'/g, "_") + Date.now().toString();


            const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true })

            // create a new page
            const page = await browser.newPage()

            // set your html as the pages content
            await page.setContent(htmlToSend, {
                waitUntil: ['domcontentloaded', 'load', "networkidle0"]
            })

            // create a pdf buffer
            // const pdfBuffer = await page.pdf({
            //     format: 'A4'
            // })

            // or a .pdf file
            await page.pdf({
                // width: '35cm',
                // height: '30cm',
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '2px',
                    bottom: '1px',
                    left: '2px',
                    right: '2px',
                },
                path: `./uploads/` + pdfName + `.pdf`
            })

            // close the browser
            browser.close()

            res.status(200).json({ data: pdfName });

        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: { global: "something went wrong", err } });
        })
}