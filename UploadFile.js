const multer = require('multer');
const path = require('path');

const storageProduct = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './public/products');
    },
    filename: (req, file, cb)=>{
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if(extname){
            cb(null, Date.now() + "_"+ file.originalname);
        }else{
            cb("Error: Only jpeg, jpg, png files are allowed");
        }
    }
});

const uploadProduct = multer({
    storage: storageProduct,
    limits:{
        fileSize:1024 * 1024 * 5 // 5Mb maximum
    },
});


// category

const storageCategory = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './public/category');
    },
    filename: (req, file, cb)=>{
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if(extname){
            cb(null, Date.now() + "_"+ file.originalname);
        }else{
            cb("Error: Only jpeg, jpg, png files are allowed");
        }
    }
});

const uploadCategory = multer({
    storage: storageCategory,
    limits:{
        fileSize: 1024 * 1024 * 5 // 5MB
    }
})

//poster


const storagePoster = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/posters');
  },
  filename: function(req, file, cb) {
    // Check file type based on its extension
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
      cb(null, Date.now() + "_" + file.originalname);
    } else {
      cb("Error: only .jpeg, .jpg, .png files are allowed!");
    }
  }
});

const uploadPosters = multer({
  storage: storagePoster,
  limits: {
    fileSize: 1024 * 1024 * 5 // limit filesize to 5MB
  },
});

module.exports = {
    uploadProduct,
    uploadCategory,
    uploadPosters
}