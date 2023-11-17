var express = require('express');
var router = express.Router();
var {createProduct,getSingleProduct,getAllProduct,updateProduct,deleteProduct,productFiltering}=require("../controller/productCtrl");
const { authMiddleware,isAdmin } = require('../middleware/authMiddleware');

router.post('/',authMiddleware,isAdmin,createProduct);
router.get('/get-product/:id',authMiddleware,isAdmin,getSingleProduct);
router.get('/get-all-products',authMiddleware,isAdmin,getAllProduct);
router.put('/update-product/:id',authMiddleware,isAdmin,updateProduct);
router.delete('/delete-product/:id',authMiddleware,isAdmin,deleteProduct);
router.get('/get-product-filtering',authMiddleware,isAdmin,productFiltering);




module.exports = router;