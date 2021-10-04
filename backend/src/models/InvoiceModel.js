import mongoose from "mongoose";

const invoiceModel = mongoose.Schema(
  {
    purchaseOrder: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "PurchaseOrder",
    },
    ordered_items: [
      {
        item: {
          //order item original reference
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Item",
        },
        qty: {
          //requested quantity
          type: Number,
          required: true,
        },
        price: {
          //requested quantity
          type: Number,
          required: true,
        },
        sub_total: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: false,
    },
    isPaid: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model("Invoice", invoiceModel);
export default Invoice;
