import mongoose from "mongoose";

const itemModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,       
      required: false,
      default: 0,
    },
    priceMeasurementUnit: {
      type: String,       
      required: false,
      default: null,
    },
    description: {
      type: String,
      required: false,
      default: null,
    },
    images: [
      {
        type: String,
        required: false,
        default: null,
      },
    ],
    addedUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
      ref:'users'
    },
    updatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
      ref:'users'
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", itemModel);
export default Item;
