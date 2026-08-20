export const getMe = async (req, res, next) => {
  try {
    const providers = req.user.authProviders?.length
      ? req.user.authProviders
      : ["local"];

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          email: req.user.email,
          emailVerified: Boolean(req.user.emailVerified),
          authProviders: providers,
          hasPassword: providers.includes("local"),
          googleLinked: providers.includes("google"),
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
