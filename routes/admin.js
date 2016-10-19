const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const AdminController = require('../controllers/AdminController');


router.post('/admin/login', AdminController.login);

router.post('/admin/deactivate-user', auth, AdminController.deactivateUser);

module.exports = router;