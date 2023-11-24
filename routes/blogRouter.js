var express = require('express');
var router = express.Router();
var {createBlog,updateBlog,showAllBlogs,deleteBlog,getBlog,likeBlog,disLikeBlog}=require('../controller/blogCtrl');
const { authMiddleware,isAdmin } = require('../middleware/authMiddleware');


router.post('/',authMiddleware,isAdmin,createBlog);
router.put('/update-blog/:id',authMiddleware,isAdmin,updateBlog);
router.get('/all-blogs',showAllBlogs);
router.delete('/delete-blog/:id',authMiddleware,isAdmin,deleteBlog);
router.get('/get-blog/:id',getBlog);
router.put('/like-blog',authMiddleware,likeBlog);
router.put('/disLike-blog',authMiddleware,disLikeBlog);

module.exports = router;