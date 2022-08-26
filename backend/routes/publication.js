const router = require("express").Router();

const publicationCtrl = require("../controllers/publication");
// const auth = require('../middleware/auth');
const multer = require("../middleware/multer-config");

//routes des publications : /api/publication
router.post("/", multer, publicationCtrl.createPublication);
router.put("/:id", multer, publicationCtrl.modifyPublication);
router.delete("/:id", multer, publicationCtrl.removePublication);
router.get("/:id", publicationCtrl.getOnePublication);
router.get("/", publicationCtrl.getAllPublications);
router.patch("/:id/like", publicationCtrl.likePublication);
router.patch("/:id/unlike", publicationCtrl.unlikePublication);

// commentaires : /api/publication
router.patch("/comment-pub/:id", publicationCtrl.commentPub);
router.patch("/edit-comment-pub/:id", publicationCtrl.editCommentPub);
router.patch("/delete-comment-pub/:id", publicationCtrl.deleteCommentPub);

module.exports = router;
