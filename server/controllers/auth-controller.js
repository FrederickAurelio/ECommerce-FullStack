const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const checkEmail = await User.findOne({ email });
    if (checkEmail) return res.json({ success: false, message: "Email already used" })
    const checkUser = await User.findOne({ userName });
    if (checkUser) return res.json({ success: false, message: "Username already exist" })

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName, email, password: hashPassword
    })

    await newUser.save();
    res.status(201).send({
      success: true,
      message: "Create new user successfull",
      user: newUser
    })
  } catch (error) {
    console.log(error)
    res.send({
      success: false,
      message: error.message
    })
  }
}

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.json({
        success: false,
        message: "User does not exist. Please register first."
      });
    }

    // Check if password matches
    const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Create JWT Token
    const token = jwt.sign({
      userName: checkUser.userName,
      id: checkUser._id,
      role: checkUser.role,
      email: checkUser.email
    }, process.env.CLIENT_SECRET_KEY, // Use environment variable for secret key
      { expiresIn: "60min" } // Token expiration time
    );

    // Send the token as an HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent access to the cookie via JavaScript
      secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
      sameSite: "strict", // Protection against CSRF attacks
      maxAge: 3600 * 1000 // 1 hour in milliseconds (match JWT expiry)
    }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        userName: checkUser.userName,
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id
      }
    });

  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: error.message
    });
  }
};


// logout
const logoutUser = (req, res) => {
  console.log("LOGOUT");

  // Attempt to clear the cookie without any extra options
  res.clearCookie("token");

  return res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};


// auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.json({
    success: false,
    message: "Unauthorized user!"
  })

  try {
    const decoded = jwt.verify(token, "CLIENT_SCECRET_KEY");
    // THIS IS BAD BECAUSE WE MUST ONLY STORE THE USER ID AND THEN FETCH TO SEND IT
    req.user = decoded;
    next();
  } catch (error) {
    res.json({
      success: false,
      message: "Unauthorized user! Please back login"
    })
  }
}

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user)
      throw new Error("User Not Found!");

    res.status(200).json({
      success: true,
      user,
      message: "Fetch User successful"
    })

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = { registerUser, loginUser, logoutUser, authMiddleware, getUserById };