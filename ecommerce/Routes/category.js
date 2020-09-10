const express = require('express');
const router = express.Router();

const { create, categoryById, read, update, remove, list } = require('../Controllers/category');
const { userById } = require('../Controllers/user');
const { requireSignin, isAuth, isAdmin } = require('../Controllers/auth');

router.get('/category/:categoryId', read);
router.post('/category/create/:userId', requireSignin, isAdmin, create);
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, update);
router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove);
router.get('/categories', list);

router.param('userId', userById);
router.param('categoryId', categoryById);

module.exports = router;
