import Site from "../models/SiteModel.js";
import asyncHandler from "express-async-handler";

// @desc Create Site
// @route POST /api/sites/
// @access Super_Admin

const createSite = asyncHandler(async (req, res) => {

    if(req.body){

        const site = new Site(req.body)
        
        await site.save()
        .then( data => {
            res.status(201).send({ success: true, 'message': "Site Created Successfully!" })
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

// @desc Get all sites
// @route GET /api/sites/
// @access Super_Admin, P_Staff, Site_Manager

const getAllSites = asyncHandler(async (req, res) => {

    await Site.find({}).populate('siteManager', { name : 1})
    .then( data => {
        res.status(200).send({ success: true, 'sites': data })
    })
    .catch( (error) => {
        console.log(error)
        res.status(200).send({ success: false, 'message': error })
    } )

});

// @desc Get site by site id
// @route GET /api/sites/:id
// @access Super_Admin
const getSiteByID = asyncHandler(async (req, res) => {

    if(req.params.id){
        await Site.findById(req.params.id)
        .then( data => {
            res.status(200).send({ success: true, 'site': data })
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

// @desc Delete Site
// @route Delete /api/sites/:id
// @access Super_Admin

const deleteSite = asyncHandler(async (req, res) => {

    if(req.params.id){
        const query = { "_id": req.params.id }
        await Site.deleteOne(query)
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

// @desc Get Sites by User ID(SITE_MANAGER)
// @route GET /api/sites/user/:id
// @access Super_Admin

const getSitesByUserID = asyncHandler(async (req, res) => {

    if(req.params.id){
        const query = { "siteManager": req.params.id }
        await Site.find(query)
        .then( data => {
            res.status(200).send({ success: true, 'sites': data })
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
    createSite,
    deleteSite,
    getAllSites,
    getSiteByID,
    getSitesByUserID,
};
