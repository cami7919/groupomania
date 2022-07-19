//Importations
const express = require ('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const password = require ('../middleware/password');
const emailValidator = require ('../middleware/emailValidator');
const uploadCtrl =require('../controllers/upload');
 const multer= require('multer');
const upload = multer();

//Authentification :  /api/auth
router.post('/signup', emailValidator, password,  userCtrl.signup);
router.post ('/login', userCtrl.login);
router.get ('/logout', userCtrl.logout);


//crud des users :/api/auth
router.get('/', userCtrl.getAllUsers)
router.get('/:id', userCtrl.getOneUser)
// router.put('/:id',   userCtrl.modifyUser);
// router.delete('/:id',   userCtrl.removeUser);

//upload img
router.post('/upload', upload.single('file'), uploadCtrl.uploadProfil);


module.exports = router;


