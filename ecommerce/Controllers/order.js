const { Order, CartItem } = require('../Models/order.js');
const { errorHandler } = require('../Helpers/dbErrorHandler');

exports.orderById = (req, res, next, id) => {
	Order.findById(id).populate('products.product', 'name price').exec((error, order) => {
		if (error || !order) {
			return res.status(400).json({
				error: errorHandler(error)
			});
		}
		req.order = order;
		next();
	});
};

exports.create = (req, res) => {
	//console.log('CREATE ORDER : ', req.body);
	req.body.order.user = req.profile;
	const order = new Order(req.body.order);
	order.save((error, data) => {
		if (error) {
			return res.status(400).json({
				error: errorHandler(error)
			});
		}
		res.json(data);
	});
};

exports.listOrders = (req, res) => {
	Order.find().populate('user', '_id name address').sort('-created').exec((error, orders) => {
		if (error) {
			return res.status(400).json({
				error: errorHandler(error)
			});
		}
		res.json(orders);
	});
};

exports.getStatusValues = (req, res) => {
	res.json(Order.schema.path('status').enumValues);
};

exports.updateOrderStatus = (req, res) => {
	Order.updateOne({ _id: req.body.orderId }, { $set: { status: req.body.status } }, (error, order) => {
		if (error) {
			return res.status(400).json({
				error: errorHandler(error)
			});
		}
		res.json(order);
	});
};