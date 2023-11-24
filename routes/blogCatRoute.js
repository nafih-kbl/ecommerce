var express = require('express');
var router = express.Router();
const { authMiddleware,isAdmin } = require('../middleware/authMiddleware');
const {createCategory,updateCategory,getCategory,getAllCategories,deleteCategory}=require("../controller/blogCtegoryCtrl")

router.post('/',authMiddleware,isAdmin,createCategory);
router.put('/:id',authMiddleware,isAdmin,updateCategory);
router.get('/:id',getCategory);
router.get('/',getAllCategories);
router.delete('/:id',authMiddleware,isAdmin,deleteCategory);


module.exports=router;