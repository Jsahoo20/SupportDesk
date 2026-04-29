const express = require('express');
const { register, login, getProfile, getUsers, updateUserRole } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validateRequest = require('../middleware/validateRequest');
const { registerSchema, loginSchema } = require('../schemas/authSchema');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/register', validateRequest(registerSchema), asyncHandler(register));
router.post('/login', validateRequest(loginSchema), asyncHandler(login));
router.get('/profile', authMiddleware, asyncHandler(getProfile));
router.get('/users', authMiddleware, roleMiddleware(['Admin']), asyncHandler(getUsers));
router.put('/users/:id', authMiddleware, roleMiddleware(['Admin']), asyncHandler(updateUserRole));

module.exports = router;
