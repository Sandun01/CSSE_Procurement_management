import mongoose from "mongoose";

const deliveryAdviceNoteModel = mongoose.Schema(
  {
    purchaseOrder: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "PurchaseOrder",
    },
    delivered_items: [
      {
        item: {
          //order item original reference
          type: mongoose.Schema.Types.ObjectId,
          required: false,
          ref: "Item",
        },
        qty: {
            //requested quantity
            type: Number,
            required: false,
        },
    },
    ],
    signedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "users",
      default: null,
    },
    status: {
      //item quality or other reason - reject item(waiting for return) => Site manager
      type: String,
      required: false,
      default: "Supplier_Delivered",
    },
  },
  {
    timestamps: true,
  }
);

const DeliveryAdviceNote = mongoose.model(
  "DeliveryAdviceNote",
  deliveryAdviceNoteModel
);
export default DeliveryAdviceNote;
