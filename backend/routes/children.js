const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { 
  getChildren, 
  createChild, 
  getChild, 
  updateChild, 
  deleteChild 
} = require('../controllers/childController');

const router = express.Router({ mergeParams: true });

// All require auth
router.use(protect);

router.route('/')
  .get(getChildren)
  .post(authorize('parent'), createChild);

router.route('/:id')
  .get(getChild)
  .put(authorize('parent'), updateChild)
  .delete(authorize('parent'), deleteChild);

module.exports = router;

