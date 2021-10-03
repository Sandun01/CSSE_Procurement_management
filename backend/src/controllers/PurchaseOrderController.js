import PurchaseOrder from "../models/PurchaseOrderModel.js";
import asyncHandler from "express-async-handler";

import Utils from "../utils/UtilsFunctions.js";

// @desc create new Requisition
// @route POST /api/purchase_orders/
// @access (siteManagerAndP_StaffAuth)

const createRequisition = asyncHandler(async (req, res) => {
  if (req.body) {
    const purchaseOrder = new PurchaseOrder(req.body);

    await purchaseOrder
      .save()
      .then((data) => {
        res
          .status(201)
          .send({ success: true, message: "Requisition Added Successfully!" });
      })
      .catch((error) => {
        console.log(error);
        res.status(200).send({ success: false, message: error });
      });
  } else {
    res.status(400).send({ success: false, message: "No Data Found" });
  }
});

// @desc Get Purchase Order by Purchase Order id
// @route GET /api/Purchase Orders/:id
// @access Super_Admin
const getPurchaseOrderByID = asyncHandler(async (req, res) => {
  if (req.params.id) {
    await PurchaseOrder.findById(req.params.id)
      .populate("site")
      .populate("orderItems.item")
      .populate("comments.addedUser", { name: 1, role: 1 })
      .then((data) => {
        res.status(200).send({ success: true, Order: data });
      })
      .catch((error) => {
        console.log(error);
        res.status(200).send({ success: false, message: error });
      });
  } else {
    res.status(200).send({ success: false, message: "ID Not Found!" });
  }
});

// @desc Delete Purchase Order
// @route Delete /api/purchase_orders/:id
// @access Super_Admin

const deletePurchaseOrderByID = asyncHandler(async (req, res) => {
  if (req.params.id) {
    const query = { _id: req.params.id };
    await PurchaseOrder.deleteOne(query)
      .then((data) => {
        res
          .status(200)
          .send({ success: true, message: "Deleted Successfully!" });
      })
      .catch((error) => {
        console.log(error);
        res.status(200).send({ success: false, message: error });
      });
  } else {
    res.status(200).send({ success: false, message: "ID Not Found!" });
  }
});

// @desc Get saved requisitions by SITE MANAGER id
// @route GET /api/purchase_orders/site_manager/saved/:id
// @access Super_Admin
const getSavedRequisitionsByUserID = asyncHandler(async (req, res) => {
  if (req.params.id) {
    var id = req.params.id;
    // var query = { status: "Saved_Requisition", "site.siteManager": id };

    try {
      var allRequisitions = await PurchaseOrder.find({
        status: "Saved_Requisition",
      })
        .populate("site", { siteManager: 1 })
        .populate("orderItems.item");

      var saved_requisitions = [];

      allRequisitions.forEach((item) => {
        if (item.site.siteManager == id) {
          saved_requisitions.push(item);
        }
      });

      if (saved_requisitions.length > 0) {
        res
          .status(200)
          .send({ success: true, requisitions: saved_requisitions });
      } else {
        res
          .status(200)
          .send({ success: false, requisitions: 0, message: "No Saved Items" });
      }
    } catch (error) {
      console.log(error);
      res.status(200).send({ success: false, message: error });
    }
  } else {
    res.status(200).send({ success: false, message: "ID Not Found!" });
  }
});

// @desc Get all requisitions by SITE MANAGER id
// @route GET /api/purchase_orders/site_manager/all/:id
// @access Super_Admin
const getAllRequisitionsByUserID = asyncHandler(async (req, res) => {
  if (req.params.id) {
    var id = req.params.id;
    // var query = { status: "Saved_Requisition", "site.siteManager": id };

    try {
      var allRequisitions = await PurchaseOrder.find({})
        .populate("site", { siteManager: 1, name: 1 })
        .populate("orderItems.item");

      var saved_requisitions = [];

      allRequisitions.forEach((item) => {
        if (item.site.siteManager == id) {
          saved_requisitions.push(item);
        }
      });

      if (saved_requisitions.length > 0) {
        res
          .status(200)
          .send({ success: true, requisitions: saved_requisitions });
      } else {
        res.status(200).send({
          success: false,
          requisitions: 0,
          message: "No Orders Found",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({ success: false, message: error });
    }
  } else {
    res.status(200).send({ success: false, message: "ID Not Found!" });
  }
});

//Check Requisition Order Items
async function checkItemAlreadyInRequisition(itemID, reqID) {
  var orderData = await PurchaseOrder.findById({ _id: reqID });
  var items = orderData.orderItems;
  var haveItem = false;

  //check item exists in list
  items.forEach((itm) => {
    if (itm.item == itemID) {
      haveItem = true;
    }
  });

  return haveItem;
}

// @desc Add new item to Requisition
// @route PUT /api/purchase_orders/items/add/:id
// @access (siteManagerAndP_StaffAuth)

const addItemsToRequisition = asyncHandler(async (req, res) => {
  if (req.body && req.params.id) {
    var reqId = req.params.id;
    var itmID = req.body.item;
    var data = req.body;

    var check = await checkItemAlreadyInRequisition(itmID, reqId);

    if (check) {
      // console.log("item already existing in the active requisition order...");

      res.status(200).send({ success: true, message: "Item_Already_Exists" });
    } else {
      // console.log("added to existing active order...");

      const findQuery = { _id: reqId };
      const updateQuery = { $push: { orderItems: data } };

      // const haveEmptyData = Utils.isEmpty(data);

      if (reqId !== null) {
        await PurchaseOrder.updateOne(findQuery, updateQuery)
          .then((response) => {
            // console.log(res);
            res.status(200).send({
              success: true,
              count: response.nModified,
              message: "Item added successfully!",
            });
          })
          .catch((error) => {
            console.log(error);
            res.status(400).send({ success: false, message: "Error" });
          });
      } else {
        res.status(400).send({ success: false, message: "Not Found" }); //data not found
      }
    }
  } else {
    res.status(400).send({ success: false, message: "No Data Found" });
  }
});

// @desc Edit item in Requisition by item Sub ID
// @route PUT /api/purchase_orders/items/edit/:id
// @access (siteManagerAndP_StaffAuth)

const editItemsInRequisition = asyncHandler(async (req, res) => {
  if (req.body && req.params.id) {
    var reqID = req.params.id;
    var data = req.body;
    const orderItemDbId = req.body.orderItemDbId;
    const qtyUnit = data.qtyUnit;
    const reqQty = data.reqQty;

    const queryOrderID = { _id: reqID, "orderItems._id": orderItemDbId };
    const queryUpdateQty = {
      $set: {
        "orderItems.$.qty_measurement_unit": qtyUnit,
        "orderItems.$.requested_qty": reqQty,
      },
    };

    await PurchaseOrder.updateOne(queryOrderID, queryUpdateQty)
      .then((response) => {
        // console.log(response)
        if (response.nModified > 0) {
          res.status(200).send({
            success: true,
            count: response.nModified,
            message: "Successfully Edited!",
          });
        } else {
          res.status(200).send({
            success: false,
            count: 0,
            message: "Edit Failed",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send({ success: false, message: "Error" });
      });
  } else {
    res.status(400).send({ success: false, message: "No Data Found" });
  }
});

// @desc delete item in Requisition by item Sub ID
// @route Delete /api/purchase_orders/items/delete/:id
// @access (siteManagerAndP_StaffAuth)

const deleteItemsInRequisition = asyncHandler(async (req, res) => {
  const reqID = req.params.id;
  const orderItemId = req.body.orderItemDbId;

  const findQuery = { _id: reqID };
  const updateQuery = { $pull: { orderItems: { _id: orderItemId } } };

  // console.log(reqID);
  // console.log("-- ", orderItemId);

  if (reqID != null && orderItemId != null) {
    await PurchaseOrder.updateOne(findQuery, updateQuery)
      .then((response) => {
        // console.log("Item Deleted from order");
        res.status(200).send({
          success: true,
          count: response.nModified,
          message: "Item Deleted from order",
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send({ success: false, message: "Error" });
      });
  } else {
    res.status(200).send({ success: false, message: "Not Found" }); //data not found
  }
});

//Add comment to requisition
async function addComment(reqID, data) {
  const findQuery = { _id: reqID };
  const updateQuery = { $push: { comments: data } };
  var return_val = 0;

  await PurchaseOrder.updateOne(findQuery, updateQuery)
    .then((response) => {
      // console.log(res);
      if (response.nModified > 0) {
        return_val = 1;
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send({ success: false, message: "Error" });
    });

  return return_val;
}

// @desc Staff Add comment to requisition
// @route PUT /api/purchase_orders/comment/add/:id
// @access (siteManagerAndP_StaffAuth)

const addCommentByStaff = asyncHandler(async (req, res) => {
  if (req.body && req.params.id) {
    var reqID = req.params.id;
    var data = req.body;
    var comment_res = 0;

    //add comments
    if (data.comment_description != "") {
      comment_res = await addComment(reqID, data);
    } else {
      comment_res = 1;
    }

    //change status of requisition
    if (comment_res == 1) {
      res.status(200).send({
        success: true,
        message: "Successfully Added Comment!",
      });
    } else {
      res
        .status(200)
        .send({ success: false, message: "Error! Comment Adding Failed" });
    }
  } else {
    res.status(400).send({ success: false, message: "No Data Found" });
  }
});

// @desc Add comment to requisition anf finalize
// @route PUT /api/purchase_orders/comment/finalize/:id
// @access (siteManagerAndP_StaffAuth)

const addCommentToRequisitionAndFinalize = asyncHandler(async (req, res) => {
  if (req.body && req.params.id) {
    // dateTime: '',
    // comment_description: '',
    // addedUser: '',
    var reqID = req.params.id;
    var data = req.body;
    var comment_res = 0;

    //add comments
    if (data.comment_description != "") {
      comment_res = await addComment(reqID, data);
    } else {
      comment_res = 1;
    }

    //change status of requisition
    if (comment_res == 1) {
      const queryOrderID = { _id: reqID };
      const queryUpdateQty = {
        $set: {
          status: "Completed_Requisition",
        },
      };

      await PurchaseOrder.updateOne(queryOrderID, queryUpdateQty)
        .then((response) => {
          // console.log(response)
          if (response.nModified > 0) {
            res.status(200).send({
              success: true,
              count: response.nModified,
              message: "Successfully Finalized Requisition!",
            });
          } else {
            res.status(200).send({
              success: false,
              count: 0,
              message: "Finalized Failed",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          res.status(400).send({ success: false, message: "Error" });
        });
    } else {
      res
        .status(200)
        .send({ success: false, message: "Error! Comment Adding Failed" });
    }
  } else {
    res.status(400).send({ success: false, message: "No Data Found" });
  }
});

// @desc Get all requisitions
// @route GET /api/purchase_orders/all
// @access Super_Admin
const getAllRequisitions = asyncHandler(async (req, res) => {
  try {
    var allRequisitions = await PurchaseOrder.find({}).populate("site", {
      siteManager: 1,
      name: 1,
    });
    res.status(200).send({ success: true, requisitions: allRequisitions });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: error });
  }
});

// @desc Approve/Reject requisition
// @route PUT /api/status/:id
// @access (siteManagerAndP_StaffAuth)

const approveRejectPurchaseOrder = asyncHandler(async (req, res) => {
  if (req.body && req.params.id) {
    var reqID = req.params.id;
    var data = req.body;

    var status_data = data.status;
    var companyDetails_data = data.companyDetails;
    var supplier_data = data.supplier;

    if (status_data === "Rejected") {
      supplier_data = null;
    }

    var queryOrderID = { _id: reqID };
    var queryUpdateQty = {
      $set: {
        status: status_data,
        companyDetails: companyDetails_data,
        supplier: supplier_data,
      },
    };
    await PurchaseOrder.updateOne(queryOrderID, queryUpdateQty)
      .then((response) => {
        // console.log(response)
        if (response.nModified > 0) {
          res.status(200).send({
            success: true,
            count: response.nModified,
            message: "Successfully Updated Status!",
          });
        } else {
          res.status(200).send({
            success: false,
            count: 0,
            message: "Error!",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send({ success: false, message: "Error" });
      });
  } else {
    res.status(400).send({ success: false, message: "No Data Found" });
  }
});

// @desc Get supplier purchase orders
// @route GET /api/supplier/:id
// @access Super_Admin
const getPurchaseOrdersBySupplierID = asyncHandler(async (req, res) => {
  if (req.params.id) {
    var id = req.params.id;
    await PurchaseOrder.find({ supplier: id })
      .populate("site", {
        siteManager: 1,
        name: 1,
      })
      .then((data) => {
        // console.log(data)
        res.status(200).send({ success: true, orders: data });
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send({ error: error });
      });
  } else {
    res.status(200).send({ success: false, message: "No data found!" });
  }
});

// @desc Site manager mark items and received qty
// @route PUT /api/check/:id
// @access (siteManagerAndP_StaffAuth)

const markOrderItemsCheckedStatus = asyncHandler(async (req, res) => {
  if (req.body && req.params.id) {
    var orderId = req.params.id;
    var data = req.body;
    var itemDBbId = data.itemDBbId;

    var qty = data.received_qty;
    var check = data.site_manager_status;

    var queryOrderID = { _id: orderId, "orderItems._id": itemDBbId };
    var queryUpdateQty = {
      $set: {
        "orderItems.$.received_qty": qty,
        "orderItems.$.site_manager_status": check,
      },
    };

    if(check == null) {
      queryUpdateQty = {
        $set: {
          "orderItems.$.received_qty": qty,
        },
      };
    }
    if (qty == null) {
      queryUpdateQty = {
        $set: {
          "orderItems.$.received_qty": qty,
        },
      };
    }

    await PurchaseOrder.updateOne(queryOrderID, queryUpdateQty)
      .then((response) => {
        // console.log(response)
        if (response.nModified > 0) {
          res.status(200).send({
            success: true,
            count: response.nModified,
            message: "Successfully Updated Status!",
          });
        } else {
          res.status(200).send({
            success: false,
            count: 0,
            message: "Update Error!",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(400).send({ success: false, message: "Error" });
      });
  } else {
    res.status(400).send({ success: false, message: "No Data Found" });
  }
});

export default {
  createRequisition,
  deletePurchaseOrderByID,
  getPurchaseOrderByID,
  getSavedRequisitionsByUserID,
  getAllRequisitionsByUserID,
  getAllRequisitions,
  addItemsToRequisition,
  editItemsInRequisition,
  deleteItemsInRequisition,
  addCommentToRequisitionAndFinalize,
  approveRejectPurchaseOrder,
  addCommentByStaff,
  getPurchaseOrdersBySupplierID,
  markOrderItemsCheckedStatus,
};
