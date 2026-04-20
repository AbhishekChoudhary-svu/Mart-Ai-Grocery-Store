// import multer from 'multer';
// import os from 'os';

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, os.tmpdir()); //  Works on both Windows & Linux
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, ''));
//     }
// });

// const upload = multer({ storage });

// export default upload;

import multer from 'multer';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/tmp'); // Specify the directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
    }
});

const upload = multer( { storage: storage,});

export default upload;