const router = require("express").Router();
const { validateTokenMiddleware } = require("../../auth/token_validation");
const upload = require("../../config/multer.js");
const {
  login,
  createJournal,
  getJournals,
  updateJournal,
  deleteJournal,
  uploadAttachment,
  getStudents
} = require("./user.controller");


router.post("/auth", login);
router.post("/create_journals",validateTokenMiddleware, createJournal)
router.post("/upload_attachment",validateTokenMiddleware, upload.single("attachment"), uploadAttachment)
router.post("/get_journals",validateTokenMiddleware,getJournals)
router.post("/update_journal/:id",validateTokenMiddleware, updateJournal)
router.post("/delete_journal/:id",validateTokenMiddleware, deleteJournal)
router.post("/get_studnets",validateTokenMiddleware, getStudents)

router.get("/",(req,res)=>res.send("API is up and working..."))


module.exports = router;
