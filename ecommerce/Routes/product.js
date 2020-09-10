const express = require('express');
const router = express.Router();

const {
	create,
	productById,
	read,
	remove,
	update,
	list,
	listRelated,
	listCategories,
	listBySearch,
	photo
} = require('../Controllers/product');
const { userById } = require('../Controllers/user');
const { requireSignin, isAdmin, isAuth } = require('../Controllers/auth');

router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.get('/product/:productId', read);
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, update);
router.get('/products', list);
router.get('/products/related/:productId', listRelated);
router.get('/products/categories', listCategories);
router.post('/products/by/search', listBySearch);
//Photo route not working
router.get('/product/photo/:productId', photo);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;
