const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserLogin = require("../../model/auth/login");
const UserRegister = require("../../model/auth/register");
const fs= require("fs");  

// generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, voterId, city, state, profileFile } = req.body;
    if (!firstName || !lastName || !email || !password ||  !voterId || !city || !state) {
      return res.status(400).json({ message: "Please add all fields" });
    } 

    const userExists = await UserRegister.findOne({ email });
    if (userExists) {
       res.status(400).json({success: false, message: "User already exists" });
    } else{
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserRegister({
        firstName,
        lastName,
        email,
        voterId,
        city,
        state,
        profileFile,
        password: hashedPassword,
      });
      const user = await newUser.save();
      if (user) {
        return res.status(200).json({ success: true, message:"User Registered Successfully"});
      } else {
        res.status(400).json({success: true, message:"something went Wrong"});
        throw new Error("Invalid user data");
      }
    }
  } catch (error) {
    console.log("error: " + error);
    res.status(500).json({success: true, message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserRegister.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "invalid credentails" });
    }
    res.json({ message: "Login user" });
  } catch (error) {}
};

const profileData = async (req, res) => {
  try {
    const id  = req.params.id;
    const user = await UserRegister.findById(id);
    if (user) {
      res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        city: user.city,
        state: user.state,
        voterId: user.voterId,
        profileFile: user.profileFile,
        // token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "invalid credentails" });
    }
    res.json({ message: "Login user" });
  } catch (error) {}
};

const uploadProfileFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const { filename, path } = req.file;
    res.status(200).json({ filename, path, status:200 });
  } catch (error) {
    res.status(400).json("file not found", { error: error.message });
  }
};
const getImages = async(req, res) => {
     const data= await UserRegister.findOne({_id:req.params.id})
     if(data.profileFile!==''){
       const images= fs.readFileSync(`uploads/${data?.profileFile}`,"base64")
       res.status(200).json({images})
     }else{
      res.status(200).json(data)
     }


     
}

module.exports = { registerUser, loginUser, profileData, uploadProfileFile, getImages };
