const multer = require("multer")

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, `./imageUploads`)
    },
    filename : (req, file, cb) => {
        cb(null, `image - ${Date.now()} - ${file.originalname}`)
    }
})


const fileFilter = (req, file, cb) => {
    if(file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
        cb(null, true)
    } else {
        cb(null, false)
        cb(new Error(`Accept only png, jpg & jpeg files!!`))
    }
}

const multerConfig = multer({
    storage,
    fileFilter
})

module.exports = multerConfig