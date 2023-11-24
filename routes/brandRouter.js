var express = require('express');
var router = express.Router();
const { authMiddleware,isAdmin } = require('../middleware/authMiddleware');
const {createBrand,updateBrand,getBrand,getAllBrands,deleteBrand}=require("../controller/brandCtr")

router.post('/',authMiddleware,isAdmin,createBrand);
router.put('/:id',authMiddleware,isAdmin,updateBrand);
router.get('/:id',getBrand);
router.get('/',getAllBrands);
router.delete('/:id',authMiddleware,isAdmin,deleteBrand);


module.exports=router;