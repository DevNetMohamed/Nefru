import mongoose from 'mongoose';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// export const getUsers = asyncHandler(async (req, res) => {
//   const users = await User.find().sort({ createdAt: -1 });

//   res.json({
//     success: true,
//     message: 'Users fetched successfully',
//     data: users,
//   });
// });

// modify to return data of the logged user only NOT ANY USER
// export const getUserById = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     res.status(400);
//     throw new Error('Invalid user id');
//   }

//   const user = await User.findById(id);

//   if (!user) {
//     res.status(404);
//     throw new Error('User not found');
//   }

//   res.json({
//     success: true,
//     message: 'User fetched successfully',
//     data: user,
//   });
// });

export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          fullName: req.user.fullName,
          email: req.user.email,
          role: req.user.role,
          avatar: req.user.avatar,
          verificationStatus: req.user.verificationStatus,
          isActive: req.user.isActive,
          createdAt: req.user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    res.status(400);
    throw new Error('Full Name and email are required');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    res.status(409);
    throw new Error('User already exists');
  }

  const user = await User.create({ fullName, email });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user,
  });
});
