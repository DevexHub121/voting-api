const express = require('express')
const router = express.Router()
const multer = require('multer');
const { registerUser, loginUser, profileData, uploadProfileFile, getImages } = require('../controllers/auth/userController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      const ext = file.originalname.split('.').pop();
      cb(null, `profile-${Date.now()}.${ext}`); // Use a unique filename based on the current timestamp
    },
  });
  
const upload = multer({ storage });

router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/upload', upload.single('file'), uploadProfileFile);
router.get('/auth/profileData/:id', profileData);
router.get('/auth/image/:id' , getImages);



module.exports = router