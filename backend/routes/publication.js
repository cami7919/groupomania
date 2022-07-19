const router = require('express').Router();

const publicationCtrl = require ('../controllers/publication');
const auth = require('../middleware/auth');
const multer = require ('../middleware/multer-config');

//routes des publications : /api/publication
router.post('/', auth,  multer, publicationCtrl.createPublication);          
router.put('/:id', auth, multer, publicationCtrl.modifyPublication);
router.delete('/:id', auth, multer, publicationCtrl.removePublication);
router.get('/:id', auth, publicationCtrl.getOnePublication);
router.get('/', auth, publicationCtrl.getAllPublications);
router.post("/:id/like", auth, publicationCtrl.likePublication);

// commentaires
 router.patch('/comment-pub/:id', publicationCtrl.commentPub);
 router.patch('/edit-comment-pub/:id', publicationCtrl.editCommentPub);
 router.patch('/delete-comment-pub/:id', publicationCtrl.deleteCommentPub);

module.exports = router ;



