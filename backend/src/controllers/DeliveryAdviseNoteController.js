import Item from "../models/ItemModel.js";
import asyncHandler from "express-async-handler";
import DeliveryAdviceNote from "../models/DeliveryAdviceNoteModel.js";

const createNote = asyncHandler(async (req, res) => {
  if (req.body) {
    const item = new DeliveryAdviceNote(req.body);
    await item
      .save()
      .then((data) => {
        res
          .status(201)
          .send({ success: true, message: "Delivery Created Successfully!" });
      })
      .catch((error) => {
        console.log(error);
        res.status(200).send({ success: false, message: error });
      });
  } else {
    res.status(400).send({ success: false, message: "No Data Found" });
  }
});

const getAllNotes = asyncHandler(async (req, res) => {
  await DeliveryAdviceNote.find({})
    .then((data) => {
      res.status(200).send({ success: true, nots: data });
    })
    .catch((error) => {
      console.log(error);
      res.status(200).send({ success: false, message: error });
    });
});

const getNotesByOrderID = asyncHandler(async (req, res) => {
  if (req.params.id) {
    var id = req.params.id;
    await DeliveryAdviceNote.find({ purchaseOrder: id })
      .populate("delivered_items.item")
      .then((data) => {
        res.status(200).send({ success: true, notes: data });
      })
      .catch((error) => {
        console.log(error);
        res.status(200).send({ success: false, message: error });
      });
  } else {
    res.status(400).send({ success: false, message: "No ID Found" });
  }
});

const getNoteByID = asyncHandler(async (req, res) => {
  if (req.params.id) {
    var id = req.params.id;
    await DeliveryAdviceNote.findById(id)
      .populate("delivered_items.item")
      .populate("signedBy")
      .then((data) => {
        res.status(200).send({ success: true, note: data });
      })
      .catch((error) => {
        console.log(error);
        res.status(200).send({ success: false, message: error });
      });
  } else {
    res.status(400).send({ success: false, message: "No ID Found" });
  }
});

const getNotesByUserID = asyncHandler(async (req, res) => {
  try {
    if (req.params.id) {
      var id = req.params.id;
      var notes = await DeliveryAdviceNote.find({}).populate("purchaseOrder");
      var resArr = [];

      notes.forEach((itm) => {
        if (itm.purchaseOrder.supplier == id) {
          resArr.push(itm);
        }
      });

      if (resArr.length > 0) {
        res.status(200).send({ success: true, notes: resArr });
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

const signNoteByUser = asyncHandler(async (req, res) => {
  if (req.body && req.params) {
    const query = { _id: req.body.id  };
    const update = {
      signedBy: req.params.id,
      status: "Completed",
    };

    await DeliveryAdviceNote.updateOne(query, update)
      .then((result) => {
        // console.log(result.modifiedCount);

        if(result.nModified > 0){
          res
            .status(200)
            .send({ success: true, message: "Signed Successfully!" });
          }
          else{
          res
            .status(200)
            .send({ success: false, message: "Error:Sign Failed!" });
        }

      })
      .catch((error) => {
        res.status(200).send({ success: false, message: error });
      });
  } else {
    res.status(200).send({ success: false, message: "No Data Found" });
  }
});

export default {
  createNote,
  getAllNotes,
  getNoteByID,
  getNotesByOrderID,
  getNotesByUserID,
  signNoteByUser,
};
