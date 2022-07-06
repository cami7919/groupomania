const router = require('express').Router();

const publicationCtrl = require ('../controllers/publication');
const auth = require('../middleware/auth');
const multer = require ('../middleware/multer-config');

//routes
router.post('/', auth,  multer, publicationCtrl.createPublication);          
router.put('/:id', auth, multer, publicationCtrl.modifyPublication);
router.delete('/:id', auth, multer, publicationCtrl.removePublication);
router.get('/:id', auth, publicationCtrl.getOnePublication);
router.get('/', auth, publicationCtrl.getAllPublications);
router.post("/:id/like", auth, publicationCtrl.likePublication);


module.exports = router ;



module.export = router ;