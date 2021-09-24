import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let receivedToken;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      receivedToken = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(receivedToken, process.env.JWT_SECRET);

      req.user = await User.findById(decodedToken.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      // res.status(401);
      throw new Error("token is broken , cannot be authroised");
    }
  }

  if (!receivedToken) {
    // res.status(401);
    throw new Error("a token is not availabe, cannot be authorized");
  }
});

// 'SUPER_ADMIN', 'SUPERVISOR', 'SUPPLIER', 'P_STAFF', 'SITE_MANAGER'

// Auth single user
const superAdminAuth = (req, res, next) => {
  var userTypes = ["SUPER_ADMIN"]
  authenticateUserRole(req, res, next, userTypes);
};

const supervisorAuth = (req, res, next) => {
  var userTypes = ["SUPERVISOR"]
  authenticateUserRole(req, res, next, userTypes);
};

const supplierAuth = (req, res, next) => {
  var userTypes = ["SUPPLIER"]
  authenticateUserRole(req, res, next, userTypes);
};

const pStaffAuth = (req, res, next) => {
  var userTypes = ["P_STAFF"]
  authenticateUserRole(req, res, next, userTypes);
};

const siteManagerAuth = (req, res, next) => {
  var userTypes = ["SITE_MANAGER"]
  authenticateUserRole(req, res, next, userTypes);
};

// Auth multiple users
const siteManagerAndP_StaffAuth = (req, res, next) => {
  var userTypes = ["P_STAFF", "SITE_MANAGER", "SUPER_ADMIN", "SUPERVISOR" ]
  authenticateUserRole(req, res, next, userTypes);
};

// Auth site manager and supplier
const authSiteManger_Supplier = (req, res, next) => {
  var userTypes = ["SITE_MANAGER", "SUPER_ADMIN", "SUPPLIER"]
  authenticateUserRole(req, res, next, userTypes);
};

// Auth all
const allAuth = (req, res, next) => {
  var userTypes = ["P_STAFF", "SITE_MANAGER", "SUPER_ADMIN", "SUPPLIER", "SUPERVISOR"  ]
  authenticateUserRole(req, res, next, userTypes);
};

const authenticateUserRole = (req, res, next, userTypes) => {
  if (req.user) {
    var user = req.user;

    if (user) {
      var role = user.role;
      var isAuth = userTypes.includes(role);
      
      if (isAuth) {
        next();
      } 
      else {
        // res.status(401);
        throw new Error("Not an Authorized User : Authentication Error!");
      }
    } else {
      // res.status(401);
      throw new Error("Authentication Error: User Token Expired!");
    }
  } else {
    // res.status(401);
    throw new Error("User Token Expired!");
  }
};

export { 
  protect,
  allAuth, 
  superAdminAuth, 
  supervisorAuth, 
  supplierAuth, 
  pStaffAuth, 
  siteManagerAuth,
  siteManagerAndP_StaffAuth,
  authSiteManger_Supplier,
 };
