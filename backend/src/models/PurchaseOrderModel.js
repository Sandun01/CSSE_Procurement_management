import mongoose from "mongoose";

const purchaseOrderModel = mongoose.Schema(
  {
    title: {
      //order title
      type: String,
      required: true,
    },
    companyDetails: {
      //company details
      name: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
      contactNumber: {
        type: String,
        required: false,
      },
    },
    site: {
      //site details , => site manager details
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Site",
    },
    supplier: {
      //supplier details
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "users",
      default: null,
    },
    requiredDate: {
      //order requested date
      type: String,
      required: false,
    },
    status: {
      // Order Status -> Pending(Requisition), Approved(p staff/supervisor), Completed
      type: String,
      required: false,
      default: "Saved_Requisition",
    },
    orderItems: [
      //ordered Items
      {
        item: {
          //order item original reference
          type: mongoose.Schema.Types.ObjectId,
          required: false,
          ref: "Item",
        },
        qty_measurement_unit: {
          //quantity measurement unit
          type: String,
          required: false,
        },
        requested_qty: {
          //requested quantity
          type: Number,
          required: false,
        },
        received_qty: {
          //received quantity - site manager
          type: Number,
          required: false,
          default: 0,
        },
        site_manager_status: {
          //item checked by site manager - site manager - Pending / Completed / Not Completed
          type: String,
          required: false,
          default: 'Pending',
        },
      },
    ],
    comments: [
      {
        dateTime: {
          type: String,
          required: false,
        },
        comment_description: {
          //order comment
          type: String,
          required: false,
        },
        addedUser: {
          type: mongoose.Schema.Types.ObjectId,
          required: false,
          ref: "users",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseOrderModel);
export default PurchaseOrder;
