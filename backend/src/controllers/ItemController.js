import Item from "../models/ItemModel.js";
import asyncHandler from "express-async-handler";


// @desc Add new Item
// @route POST /api/items/
// @access Super_Admin, P_Staff, Site_Manager

const addNewItem = asyncHandler(async (req, res) => {

    if(req.body){

        const item = new Item(req.body)
        
        await item.save()
        .then( data => {
            res.status(201).send({ success: true, 'message': "Item Added Successfully!" })
        })
        .catch( (error) => {
            console.log(error)
            res.status(200).send({ success: false, 'message': error })
        } )
    }
    else{
        res.status(400).send({ success: false, message: 'No Data Found' })
    }

});

// @desc Get all items
// @route GET /api/items/
// @access Super_Admin, P_Staff, Site_Manager

const getAllItems = asyncHandler(async (req, res) => {

    await Item.find({})
    .then( data => {
        res.status(200).send({ success: true, 'items': data })
    })
    .catch( (error) => {
        console.log(error)
        res.status(200).send({ success: false, 'message': error })
    } )

});

// @desc Get item by item id
// @route GET /api/items/:id
// @access Super_Admin, P_Staff, Site_Manager
const getItemByID = asyncHandler(async (req, res) => {

    if(req.params.id){
        // console.log(req.params.id)
        await Item.findById(req.params.id).populate('addedUser').populate('updatedUser')
        .then( data => {
            // console.log(data)
            res.status(200).send({ success: true, 'item': data })
        })
        .catch( (error) => {
            console.log(error)
            res.status(200).send({ success: false, 'message': error })
        } )
    }
    else{
        res.status(200).send({ success: false, 'message': 'ID Not Found!' })
    }

});


// @desc update item by item id
// @route PUT /api/items/:id
// @access Super_Admin, P_Staff, Site_Manager
const updateItemByID = asyncHandler(async (req, res) => {

    if(req.body && req.params){

        const query = { "_id": req.params.id };
        const update = {
            "name":  req.body.name,
            "brand": req.body.brand,
            "category": req.body.category,
            "price": req.body.price,
            "description": req.body.description,
            "priceMeasurementUnit": req.body.priceMeasurementUnit,
            "image": req.body.image,
            "addedUser": req.body.addedUser,
            "updatedUser": req.body.updatedUser
         };
        
        await Item.updateOne( query , update)
        .then( result => {
            // console.log(result.modifiedCount);
            res.status(200).send({ success: true, 'message': "Item Updated Successfully!" })
        })
        .catch( (error) => {
            res.status(200).send({ success: false, 'message': error })
        } )

    }else{
        res.status(200).send({ success: false, 'message': "No Data Found" })
    }

});


// @desc Delete item by item id
// @route DELETE /api/items/:id
// @access Super_Admin, P_Staff, Site_Manager
const deleteItemByID = asyncHandler(async (req, res) => {

    if(req.params.id){
        const query = { "_id": req.params.id }
        await Item.deleteOne(query)
        .then( data => {
            res.status(200).send({ success: true, message: 'Deleted Successfully!'})
        })
        .catch( (error) => {
            console.log(error)
            res.status(200).send({ success: false, 'message': error })
        } )
    }
    else{
        res.status(200).send({ success: false, 'message': 'ID Not Found!' })
    }

});


export default { 
    addNewItem,
    getAllItems,
    getItemByID,
    updateItemByID,
    deleteItemByID,
};
