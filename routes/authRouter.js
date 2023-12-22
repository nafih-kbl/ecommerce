var express = require('express');
var router = express.Router();
var {
    createUser,
    loginUserCtrl,
    getAllUser,
    getSingleUSer,
    deleteAuser,
    updtateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logoutUser,
    updatePassword,
    forgetPasswordToken,
    resetPassword,
    loginAdmin,
    addToCart,
    veiwUserCart,
    applyCoupen,
    createOrder,
    getOrders,
    updateOrderStatus
}=require('../controller/userCtrl');
const { authMiddleware,isAdmin } = require('../middleware/authMiddleware');
/* GET users listing. */
router.post('/register',createUser);
router.post('/login',loginUserCtrl);
router.post('/admin-login',loginAdmin);
router.put('/password',authMiddleware,updatePassword);
router.post('/forget-password',forgetPasswordToken);
router.post('/add-to-cart',authMiddleware,addToCart);
router.get('/user-cart',authMiddleware,veiwUserCart);
router.post('/create-order',authMiddleware,isAdmin,createOrder);
router.get('/view-orders',authMiddleware,getOrders);
router.put('/update-order-status/:id',authMiddleware,isAdmin,updateOrderStatus);
router.put('/apply-coupen',authMiddleware,applyCoupen);
router.put('/resetPassword/:token',resetPassword);
router.get('/getAllUser',authMiddleware,isAdmin,getAllUser);
router.get('/getUser/:id',authMiddleware,getSingleUSer);
router.delete('/deleteUser/:id',deleteAuser);
router.put('/updateUser/:id',updtateUser);
router.put('/logOutUser',logoutUser);
router.put('/blockUser/:id',authMiddleware,isAdmin,blockUser);
router.put('/unblockUser/:id',authMiddleware,isAdmin,unblockUser);
router.get('/refreshToken',handleRefreshToken);



module.exports = router;
