const express = require('express');
const router = express.Router();
const { getBlogByKey,createBlog, getUserBlogs, deleBlogs, updateBlogs, allBlogs ,getSpecificBlog,likeBlog} = require('../controllers/blogController');
const protect = require('../middleware/authMiddleWare');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blogit-images', // Your folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});

const upload = multer({ storage: storage });
router.get('/allblog', allBlogs);
router.post('/create',protect,upload.array('images',3), createBlog);
router.get('/get',protect, getUserBlogs);
router.delete('/delete/:id',protect, deleBlogs);
router.put('/update/:id',protect, updateBlogs);
router.get('/getspecific/:bid',protect,getSpecificBlog);
router.patch('/like/:bid/:uid',protect, likeBlog);
router.get('/search/:key', getBlogByKey);
module.exports = router;