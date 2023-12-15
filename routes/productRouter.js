var express = require('express');
var router = express.Router();
var {
    createProduct,
    getSingleProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    productFiltering,
    addToWishlist,
    ratingProduct,
    uploadImage
}=require("../controller/productCtrl");
const { authMiddleware,isAdmin } = require('../middleware/authMiddleware');
const {productImageResize,uploadPhoto } = require('../middleware/uploadImages');

router.post('/',authMiddleware,isAdmin,createProduct);
router.get('/get-product/:id',authMiddleware,isAdmin,getSingleProduct);
router.get('/get-all-products',authMiddleware,isAdmin,getAllProduct);
router.put('/update-product/:id',authMiddleware,isAdmin,updateProduct);
router.put('/upload-file/:id',authMiddleware,isAdmin,uploadPhoto.array('images',10),productImageResize,uploadImage);
router.put('/add-wishlist',authMiddleware,addToWishlist);
router.put('/add-rating',authMiddleware,ratingProduct);
router.delete('/delete-product/:id',authMiddleware,isAdmin,deleteProduct);
router.get('/get-product-filtering',authMiddleware,isAdmin,productFiltering);




module.exports = router;