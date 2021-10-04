import Item from "../models/ItemModel.js";
import asyncHandler from "express-async-handler";
import Invoice from "../models/InvoiceModel.js";

const createInvoice = asyncHandler(async (req, res) => {
  if (req.body) {
    const item = new Invoice(req.body);
    await item
      .save()
      .then((data) => {
        res
          .status(201)
          .send({ success: true, message: "Invoice Created Successfully!" });
      })
      .catch((error) => {
        console.log(error);
        res.status(200).send({ success: false, message: error });
      });
  } else {
    res.status(400).send({ success: false, message: "No Data Found" });
  }
});

const getAllInvoicesBySupplierID = asyncHandler(async (req, res) => {
  try {
    if (req.params.id) {
      var id = req.params.id;
      var invoices = await Invoice.find({}).populate("purchaseOrder");
      var resArr = [];

      invoices.forEach((itm) => {
        if (itm.purchaseOrder.supplier == id) {
          resArr.push(itm);
        }
      });

      if (resArr.length > 0) {
        res.status(200).send({ success: true, invoices: resArr });
      } else {
        res.status(200).send({ success: false, message: "No Items Found" });
      }
    } else {
      res.status(400).send({ success: false, message: "No ID Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(200).send({ success: false, message: error });
  }
});

const getInvoicesByOrderID = asyncHandler(async (req, res) => {
  if (req.params.id) {
    var id = req.params.id;
    await Invoice.find({ purchaseOrder: id })
      .populate("ordered_items.item")
      .then((data) => {
        res.status(200).send({ success: true, invoices: data });
      })
      .catch((error) => {
        console.log(error);
        res.status(200).send({ success: false, message: error });
      });
  } else {
    res.status(400).send({ success: false, message: "No ID Found" });
  }
});

const getInvoiceByID = asyncHandler(async (req, res) => {
  if (req.params.id) {
    var id = req.params.id;
    await Invoice.findById(id)
      .populate("ordered_items.item")
      .then((data) => {
        res.status(200).send({ success: true, invoice: data });
      })
      .catch((error) => {
        console.log(error);
        res.status(200).send({ success: false, message: error });
      });
  } else {
    res.status(400).send({ success: false, message: "No ID Found" });
  }
});

export default {
  createInvoice,
  getAllInvoicesBySupplierID,
  getInvoicesByOrderID,
  getInvoiceByID,
};
