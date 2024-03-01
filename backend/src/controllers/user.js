import { User } from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { revokeToken } from "../utils/token.js";
import { FRONTEND_DOMAIN } from "../constants.js";

const generateAccessAndRefreshTokens = async (userId, ip, userAgent) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken(ip, userAgent);
    const refreshToken = user.generateRefreshToken(ip, userAgent);

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Error generating access and refresh tokens: " + error.message
    );
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
    req.ip,
    req.headers["user-agent"]
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    domain: FRONTEND_DOMAIN,
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: null },
    },
    { new: true }
  );

  if (!user) {
    throw new ApiError(401, "Unauthorized request");
  }

  const existingToken =
    req.cookie?.accessToken ||
    req.body.headers?.Authorization.replace("Bearer ", "") ||
    req.headers["authorization"].replace("Bearer ", "");

  if (!existingToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    await revokeToken(existingToken);
  } catch (error) {
    console.error("Error revoking token:", error);
    throw new ApiError(500, "Logout failed. Please try again later.");
  }

  const options = {
    domain: FRONTEND_DOMAIN,
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { loginUser, logoutUser };
