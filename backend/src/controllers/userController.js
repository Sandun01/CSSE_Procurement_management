import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/genarateToken.js';
import jwt from 'jsonwebtoken';

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
    res.status(401).send({ message: 'Invalid Credentials.' });
  }
});

// @desc  Add a new user
// @route POST /api/users/register
// @access Admin

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, address, contactNumber } = req.body;

  const chk_user_existence = await User.findOne({ email: email });

  if (chk_user_existence) {
    res.status(200).send({
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
  } else {
    // throw new Error('This user account cannot be created. Try again')
    res.status(200).send({ message: 'Error.Please Try again' });
  }
});

export default {
  createUser,
  authUser,
};
