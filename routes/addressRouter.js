var express = require('express');
var router = express.Router();
const {
    createAddresses,
    updateAddress
}=require('../controller/addressCtrl');
const { authMiddleware,isAdmin } = require('../middleware/authMiddleware');


/* GET home page. */
router.post('/',authMiddleware,isAdmin,createAddresses);
router.put('/:addressId',authMiddleware,isAdmin,updateAddress);

module.exports = router; 
