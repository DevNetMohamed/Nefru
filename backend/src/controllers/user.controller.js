export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          email: req.user.email,
          role: req.user.role,
          status: req.user.status,
          profileId: req.user.profileId,
          roleProfile: req.user.roleProfile,
          createdAt: req.user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
