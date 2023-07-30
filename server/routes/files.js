const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('../jwt/jwt.js');
const wrapper = require('./wrapper.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'files')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  })
  
const upload = multer({storage: storage});

router.post("/", upload.single('file'), (req, res) => {
    if (!jwt.verifyJWT(req.headers.authorization)) 
      return wrapper.unauthorized_response(res);

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send({data: req.file.filename});
})

router.get("/:filename", (req, res) => {
    if (!jwt.verifyJWT(req.headers.authorization)) 
      return wrapper.unauthorized_response(res);

    const file_name = req.params.filename;
    const file_path = path.join(__dirname, '../files', file_name);

    fs.access(file_path, fs.constants.F_OK, (err) => {
        if (err){
            return res.status(404).send({error: 'File not Found'});
        }
        res.sendFile(file_path);
    })
})

module.exports = router;
