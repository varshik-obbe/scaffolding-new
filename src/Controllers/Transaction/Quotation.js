import mongoose from "mongoose";
import fs from "fs";
import ParseErrors from "../../utils/ParseErrors";
import Quotation from "../../models/Quotation";
import Handlebars from "handlebars";
import puppeteer from "puppeteer";
import { promisify } from "util";
import Year from "../../models/year";

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
                founddata.loadingcharge = req.body.data.loadingcharge


            founddata.save(function (err, updateddata) {
                if (err)
                    res.status(500).send(err);

                res.status(200).json({ success: { global: "Quotation is updated successfully" } })
            })

        }
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

            let customername = quotationdata[0].customername;

            let customernumber = quotationdata[0].customercontactnumber;

            let ws = quotationdata[0].ws;

            let loadingandhandling = quotationdata[0].loadingcharge;

            let gst = quotationdata[0].tax;


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

            let pageoneislast = false;
            let pagetwoislast = false;
            let pagethreeislast = false;
            let pageone = [];
            let pageTwo = [];
            let pageThree = [];
            let pageOneData = [];
            let pageOneImgs = [];
            let pageTwoImgs = [];
            let pageThreeImgs = [];
            let pageoneRowspan = 0;
            let pagetwoRowspan = 0;
            let pagethreeRowspan = 0;
            let pageonetotal = 0;
            let pagetwototal = 0;
            let pagethreetotal = 0;
            let pageonesubtotal = 0;
            let pagetwosubtotal = 0;
            let pagethreesubtotal = 0;
            let pageonegst = 0;
            let pagetwogst = 0;
            let pagethreegst = 0;
            let pageonegsttotal = 0;
            let pagetwogsttotal = 0;
            let pagethreegsttotal = 0;
            let pageTwoData = [];
            let pageThreeData = [];
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
                        quotationdata[0].addeditemlist[i].totalcost = parseFloat(itemlist.totalcost) * parseInt(itemlist.quantity);
                    }

                    quotationdata[0].addeditemlist[i].totalcost = parseFloat(quotationdata[0].addeditemlist[i].totalcost)
                    quotationdata[0].addeditemlist[i].totalcost = quotationdata[0].addeditemlist[i].totalcost.toFixed(2)

                    if (itemlist.itemdiscountamount == '0.00' || itemlist.itemdiscountamount == 'NaN' || itemlist.itemdiscountamount == null) {
                        quotationdata[0].addeditemlist[i].itemdiscountamount = "0";
                    }
                })

                quotationdata[0].addeditemlist.forEach((ele, i) => {
                    if (i == 0 && quotationdata[0].addeditemlist.length > 1) {
                        if(ele.itemdescription.length < 850) {
                            pageone.push(i);
                            pageOneImgs.push(encodeURI(quotationdata[0].addeditemlist[i].itemimage))
                            if (ele.itemdescription.length + quotationdata[0].addeditemlist[i + 1].itemdescription.length < 850) {
                                pageone.push(i + 1);
                                pageOneImgs.push(encodeURI(quotationdata[0].addeditemlist[i + 1].itemimage))
                                if (quotationdata[0].addeditemlist.length > 2) {
                                    if (ele.itemdescription.length + quotationdata[0].addeditemlist[i + 1].itemdescription.length + quotationdata[0].addeditemlist[i + 2].itemdescription.length < 850) {
                                        pageone.push(i + 2);
                                        pageOneImgs.push(encodeURI(quotationdata[0].addeditemlist[i + 2].itemimage))
                                        if (quotationdata[0].addeditemlist.length > 3) {
                                            if (ele.itemdescription.length + quotationdata[0].addeditemlist[i + 1].itemdescription.length + quotationdata[0].addeditemlist[i + 2].itemdescription.length + quotationdata[0].addeditemlist[i + 3].itemdescription.length < 850) {
                                                pageone.push(i + 3);
                                                pageOneImgs.push(quotationdata[0].addeditemlist[i + 3].itemimage)
                                                if (quotationdata[0].addeditemlist.length > 4) {
                                                    if (ele.itemdescription.length + quotationdata[0].addeditemlist[i + 1].itemdescription.length + quotationdata[0].addeditemlist[i + 2].itemdescription.length + quotationdata[0].addeditemlist[i + 3].itemdescription.length + quotationdata[0].addeditemlist[i + 4].itemdescription.length < 850) {
                                                        pageone.push(i + 4);
                                                        pageOneImgs.push(quotationdata[0].addeditemlist[i + 4].itemimage)
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
                                if (quotationdata[0].addeditemlist[pageone.length].itemdescription.length < 1100) {
                                    pageTwo.push(pageone.length)
                                    pageTwoImgs.push(quotationdata[0].addeditemlist[pageone.length].itemimage)
                                }
                                if(quotationdata[0].addeditemlist.length > (pageone.length + 1) && quotationdata[0].addeditemlist[pageone.length].itemdescription.length + quotationdata[0].addeditemlist[pageone.length + 1].itemdescription.length < 1100) {
                                    pageTwo.push(pageone.length + 1)
                                    pageTwoImgs.push(quotationdata[0].addeditemlist[pageone.length + 1].itemimage)
                                }
                                if(quotationdata[0].addeditemlist.length > (pageone.length + 2) && quotationdata[0].addeditemlist[pageone.length].itemdescription.length + quotationdata[0].addeditemlist[pageone.length + 1].itemdescription.length + quotationdata[0].addeditemlist[pageone.length + 2].itemdescription.length < 1100) {
                                    pageTwo.push(pageone.length + 2)
                                    pageTwoImgs.push(quotationdata[0].addeditemlist[pageone.length + 2].itemimage)
                                }
                                if(quotationdata[0].addeditemlist.length > (pageone.length + 3) && quotationdata[0].addeditemlist[pageone.length].itemdescription.length + quotationdata[0].addeditemlist[pageone.length + 1].itemdescription.length + quotationdata[0].addeditemlist[pageone.length + 2].itemdescription.length + quotationdata[0].addeditemlist[pageone.length + 3].itemdescription.length < 1100) {
                                    pageTwo.push(pageone.length + 3)
                                    pageTwoImgs.push(quotationdata[0].addeditemlist[pageone.length + 3].itemimage)
                                }
                            }
                        }
                        if(pageTwo.length > 0) {
                            if (quotationdata[0].addeditemlist.length > (pageone.length + pageTwo.length)) {
                                if (quotationdata[0].addeditemlist[pageone.length + pageTwo.length].itemdescription.length < 1100) {
                                    pageThree.push(pageone.length  + pageTwo.length)
                                    pageThreeImgs.push(quotationdata[0].addeditemlist[pageone.length  + pageTwo.length].itemimage)
                                }
                                if(quotationdata[0].addeditemlist.length > (pageone.length  + pageTwo.length + 1) && quotationdata[0].addeditemlist[pageone.length  + pageTwo.length].itemdescription.length + quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + 1].itemdescription.length < 1100) {
                                    pageThree.push(pageone.length  + pageTwo.length + 1)
                                    pageThreeImgs.push(quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + 1].itemimage)
                                }
                                if(quotationdata[0].addeditemlist.length > (pageone.length  + pageTwo.length + 2) && quotationdata[0].addeditemlist[pageone.length  + pageTwo.length].itemdescription.length + quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + 1].itemdescription.length + quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + 2].itemdescription.length < 1100) {
                                    pageThree.push(pageone.length  + pageTwo.length + 2)
                                    pageThreeImgs.push(quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + 2].itemimage)
                                }
                                if(quotationdata[0].addeditemlist.length > (pageone.length  + pageTwo.length + 3) && quotationdata[0].addeditemlist[pageone.length  + pageTwo.length].itemdescription.length + quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + 1].itemdescription.length + quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + 2].itemdescription.length + quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + 3].itemdescription.length < 1100) {
                                    pageThree.push(pageone.length  + pageTwo.length + 3)
                                    pageThreeImgs.push(quotationdata[0].addeditemlist[pageone.length  + pageTwo.length + 3].itemimage)
                                }
                            }
                        }
                    }
                    else if((i == 0 && quotationdata[0].addeditemlist.length == 1)) {
                        pageone.push(i);
                        pageOneImgs.push(quotationdata[0].addeditemlist[i].itemimage)
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
                        if(index == 0) {                                                    
                          data["pageOneImgs"] = pageOneImgs;
                          data["pageoneRowspan"] = pageone.length;
                        }
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
                    pageonegst = parseFloat(pageonesubtotal) * (parseFloat(quotationdata[0].tax) / 100);
                    pageonegsttotal = pageonegst + pageonesubtotal;
                    pageonesubtotal = pageonesubtotal.toFixed(2);
                    pageonetotal = pageonetotal.toFixed(2);
                    pageonegst = pageonegst.toFixed(2);
                    pageonegsttotal = pageonegsttotal.toFixed(2);
                    pageoneislast = true;
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
                        if(index == 0) {
                          data["pageTwoImgs"] = pageTwoImgs;
                          data["pagetwoRowspan"] = pageTwo.length;
                        } 
                        pageTwoData.push(data);
                    });
                    let allpagesTotal = parseFloat(pagetwototal) + parseFloat(pageonetotal);
                    pagetwosubtotal = parseFloat(ws) + parseFloat(allpagesTotal) + parseFloat(loadingandhandling);
                    pagetwogst = parseFloat(pagetwosubtotal) * (parseFloat(quotationdata[0].tax) / 100);
                    pagetwogsttotal = pagetwogst + pagetwosubtotal;
                    pagetwosubtotal = pagetwosubtotal.toFixed(2);
                    pagetwototal = pagetwototal.toFixed(2);
                    pagetwogst = pagetwogst.toFixed(2);
                    pagetwogsttotal = pagetwogsttotal.toFixed(2);
                    pageoneislast = false;
                    pagetwoislast = true;
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
                        if(index == 0) {
                          data["pageThreeImgs"] = pageThreeImgs;
                          data["pagethreeRowspan"] = pageThree.length;
                        } 
                        pageThreeData.push(data);
                    });
                    let allpagesTotal = parseFloat(pagethreetotal) + parseFloat(pagetwototal) + parseFloat(pageonetotal);
                    pagethreesubtotal = parseFloat(ws) + parseFloat(allpagesTotal) + parseFloat(loadingandhandling);
                    pagethreegst = parseFloat(pagethreesubtotal) * (parseFloat(quotationdata[0].tax) / 100);
                    pagethreegsttotal = pagethreegst + pagethreesubtotal;
                    pagethreesubtotal = pagethreesubtotal.toFixed(2);
                    pagethreetotal = pagethreetotal.toFixed(2);
                    pagethreegst = pagethreegst.toFixed(2);
                    pagethreegsttotal = pagethreegsttotal.toFixed(2);
                    pagetwoislast = false;
                    pagethreeislast = true;
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
                base_url: base_url,
                customername: customername,
                customernumber: customernumber,
                ws: ws,
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
                pageonesubtotal: pageonesubtotal,
                pagetwosubtotal: pagetwosubtotal,
                pagethreesubtotal: pagethreesubtotal,
                loadingandhandling: loadingandhandling,
                pageoneislast: pageoneislast,
                pagetwoislast: pagetwoislast,
                pagethreeislast: pagethreeislast
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
                    bottom: '2px',
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