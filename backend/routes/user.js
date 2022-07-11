//Importations
const express = require ('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const password = require ('../middleware/password');
const emailValidator = require ('../middleware/emailValidator');

//Authentification
router.post('/signup', emailValidator, password,  userCtrl.signup);
router.post ('/login', userCtrl.login);


//crud des users
router.get('/', userCtrl.getAllUsers)
router.get('/:id', userCtrl.getOneUser)
router.put('/:id', auth, multer, userCtrl.modifyUser);
router.delete('/:id', auth, multer, userCtrl.removeUser);


module.exports = router;


