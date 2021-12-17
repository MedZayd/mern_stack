const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
	Product.findAll((products) => {
		const productlist = products.map((p) => {
			if (p.description.length > 100) {
				return { ...p, description: p.description.slice(0, 100) + '...' };
			}
			return p;
		});
		res.render('shop/product-list', {
			products: productlist,
			docTitle: 'All Products',
			path: '/products',
		});
	});
};

exports.getProduct = (req, res, next) => {
	const { productId } = req.params;
	Product.findById(productId, (product) => {
		if (product) {
			res.render('shop/product-detail', {
				product,
				docTitle: product.title,
				path: '/products',
			});
		} else {
			res.redirect('/');
		}
	});
};

exports.getIndex = (req, res, next) => {
	Product.findAll((products) => {
		let productlist = products;
		if (products.length > 4) {
			productlist = products.slice(0, 4);
		}
		productlist = productlist.map((p) => {
			if (p.description.length > 100) {
				return { ...p, description: p.description.slice(0, 100) + '...' };
			}
			return p;
		});
		res.render('shop/index', {
			products: productlist,
			docTitle: 'Shop.com',
			path: '/',
		});
	});
};

exports.getCart = (req, res, next) => {
	res.render('shop/cart', {
		path: '/cart',
		docTitle: 'My Cart',
	});
};

exports.postCart = (req, res, next) => {
	const { productId } = req.body;
	Product.findById(productId, (product) => {
		if (product) {
			Cart.addProduct(product);
			res.redirect('/products');
		} else {
			res.status(404).render('404', { docTitle: 'Page not found', path: '' });
		}
	});
};

exports.getOrders = (req, res, next) => {
	res.render('shop/orders', {
		path: '/orders',
		docTitle: 'My Orders',
	});
};

exports.getCheckout = (req, res, next) => {
	res.render('shop/checkout', {
		path: '/checkout',
		docTitle: 'Checkout',
	});
};
