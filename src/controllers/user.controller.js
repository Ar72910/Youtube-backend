import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/Cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {

    // email , name , password , avatar -> user details from fronted 
    // add validation non empty
    // check if user already exist or not
    // check for img check for avatar
    // upload them to cloudinary
    // create user object in DB
    // remove password and refresh token field from response
    // check for user creation
    // return res

    // avatar,coverImage,

    const { username, email, fullName, password } = req.body
    console.log("emial: ", email);

    if (
        [fullName, password, username, email].some((filed) => filed?.trim() === "")
    ) {
        throw new ApiError(400, "Fields are required")

    }
    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, 'user name or email id already exist')
    }

    // console.log(req.files?.avatar[0]?.path);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.avatar[0]?.path ;
    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avatar file  is required');

    }


    // upload them to coloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, 'Avatar file  is required');
        
    }
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
        
        
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,'User Registered Successfully')
    )

})


export { registerUser }