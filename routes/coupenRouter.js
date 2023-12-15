var express = require('express');
var router = express.Router();
const { authMiddleware,isAdmin } = require('../middleware/authMiddleware');
const {
    createCoupen,
    updateCoupen,
    getCoupen,
    getAllCoupen,
    deleteCoupen
}=require("../controller/coupenCtrl")

router.post('/',authMiddleware,isAdmin,createCoupen);
router.put('/:id',authMiddleware,isAdmin,updateCoupen);
router.get('/:id',getCoupen);
router.get('/',getAllCoupen);
router.delete('/:id',authMiddleware,isAdmin,deleteCoupen);


module.exports=router;