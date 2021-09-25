import mongoose from "mongoose";

const siteModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    siteManager: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const Site = mongoose.model("Site", siteModel);
export default Site;
