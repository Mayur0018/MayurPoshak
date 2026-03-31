const express = require('express');
const addressController = require('../controllers/addressController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All address routes are protected
router.use(authMiddleware.protect);

router
  .route('/')
  .get(addressController.getAllAddresses)
  .post(addressController.createAddress);

router
  .route('/:id')
  .patch(addressController.updateAddress)
  .delete(addressController.deleteAddress);

module.exports = router;
