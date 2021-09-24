import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/genarateToken.js";
import jwt from "jsonwebtoken";

// @desc  Fetch validate the user in Login credentials and then send a token
// @route POST /api/users/login
// @access Public

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: generateToken(user._id),
    });
  } else {
    res.status(401).send({ message: "Invalid Credentials." });
  }
});

// @desc  Get user profile
// @route GET /api/users/view/:id
// @access Admin

const getUserByID = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      contactNumber: user.contactNumber,
    });
  } else {
    res.status(200).send({ success: false, message: "User account not found." });
  }
});

// @desc  Add a new user
// @route POST /api/users/register
// @access Admin

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, address, contactNumber } = req.body;

  const chk_user_existence = await User.findOne({ email: email });

  if (chk_user_existence) {
    res
      .status(200)
      .send({
        message: "There's a member already registered with that email.",
      });
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    address,
    contactNumber,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      address: user.address,
      contactNumber: user.contactNumber,
    });
  } 
  else {
    // throw new Error('This user account cannot be created. Try again')
    res.status(200).send({ message: "Error.Please Try again" });
  }
});

// @desc  Get request to all users
// @route PUT /api/users
// @access Private/ admin

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, {password: 0});
  res.json(users);
});

// @desc  check user token
// @route POST /api/users//profile/auth
// @access System/Admin

const checkTokenExpiration = asyncHandler(async (req, res) => {
  const JWTToken = req.body.accessToken;

  try {
    var expTime = jwt.decode(JWTToken).exp;
    var timeNow = Date.now() / 1000;
    // console.log(expTime, timeNow);
    
    if (expTime > timeNow) {
      const decodedData = jwt.decode(JWTToken);
      const user = await User.findById(decodedData.id);
      // console.log(user);

      if (user) {
        res.status(200).send({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            address: user.address,
            contactNumber: user.contactNumber,
          },
          accessToken: JWTToken,
          message: "Success",
        });
      }
      else{
        res.status(200).send({ message: "Not found" });
      }
    } else {
      res.status(200).send({ message: "Expired" });
    }
  } catch (error) {
    res.status(400).send({ error: error.message, message: "Error" });
  }
});

// @desc  Delete user by id
// @route DELETE /api/users/delete/:id
// @access Private/ admin

const deleteUser = asyncHandler(async (req, res) => {

  if(req.params.id){
    const data = await User.deleteOne({ "_id": req.params.id });
    // console.log(data);
    res.status(200).send({ success: true, message: "success", });
  }
  else{
    res.status(200).send({ success: false, message: "failed", });
  }

});

// other -----------------------------------------------------------------------

// @desc Get all Site Managers
// @route GET /api/users/site_managers
// @access Super_Admin, P_Staff, Site_Manager

const getAllSiteManagers = asyncHandler(async (req, res) => {

  await User.find({ "role": "SITE_MANAGER" }, { "name": 1, })
  .then( data => {
      res.status(200).send({ success: true, 'users': data })
  })
  .catch( (error) => {
      console.log(error)
      res.status(200).send({ success: false, 'message': error })
  } )

});

// @desc Get all Suppliers
// @route GET /api/users/supplier
// @access Super_Admin, P_Staff, Site_Manager

const getAllSuppliers = asyncHandler(async (req, res) => {

  await User.find({ "role": "SUPPLIER" }, { "name": 1, })
  .then( data => {
      res.status(200).send({ success: true, 'users': data })
  })
  .catch( (error) => {
      console.log(error)
      res.status(200).send({ success: false, 'message': error })
  } )

});


export default { 
  getUserByID, 
  createUser, 
  getUsers, 
  authUser, 
  checkTokenExpiration, 
  deleteUser,

  //other
  getAllSiteManagers,
  getAllSuppliers,

};
