var multer  = require('multer')

var storage = multer.diskStorage({ 
    destination: function (req, file, cb) { 
    cb(null,'public/uploads/images')  //you tell where to upload the files, 
    }, 
    filename: function (req, file, cb) { 
    cb(null, file.fieldname + '-' + Date.now() + '.png') 
    } 
  }) 
  
  var upload = multer({storage: storage, 
    onFileUploadStart: function (file) { 
     console.log(file.originalname + ' is starting ...') 
    }, 
  }); 

exports.post_img_upload = upload