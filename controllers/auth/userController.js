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
    console.log(req.body)
    if (!firstName || !lastName || !email || !password ||  !voterId || !city || !state) {
      return res.status(400).json({ message: "Please add all fields" });
    } 

    const userExists = await UserRegister.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

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
      return res.status(200).json("User Registered Successfully");
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    console.log("error: " + error);
    res.status(500).json({ message: "Internal Server Error" });
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
    console.log("id ", id);
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
     if(data){
       const images= fs.readFileSync(`uploads/${data.profileFile}`,"base64")
       res.status(200).json({images})
     }


     
}

module.exports = { registerUser, loginUser, profileData, uploadProfileFile, getImages };
