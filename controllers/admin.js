const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
	Product.findAll((products) => {
		const productlist = products.map((p) => {
			if (p.description.length > 100) {
				return { ...p, description: p.description.slice(0, 100) + '...' };
			}
			return p;
		});
		res.render('admin/products', {
			products: productlist,
			docTitle: 'All Products',
			path: '/admin/products',
		});
	});
};

exports.getAddProduct = (req, res, next) => {
	res.render('admin/product-form', {
		docTitle: 'Add New Product',
		path: '/admin/add-product',
		formAction: '/admin/add-product',
		product: {
			title: '',
			imageUrl: '',
			description: '',
			price: 0,
			id: null,
		},
	});
};

exports.getEditProduct = (req, res, next) => {
	const { productId } = req.params;
	Product.findById(productId, (product) => {
		if (product) {
			res.render('admin/product-form', {
				docTitle: 'Edit Product',
				path: '/admin/edit-product',
				formAction: '/admin/edit-product',
				product,
			});
		} else {
			res.redirect('/');
		}
	});
};

exports.postSaveProduct = (req, res, next) => {
	const { id, title, description, imageUrl, price } = req.body;
	let product;
	if (id) {
		product = { id, title, description, imageUrl, price };
	} else {
		product = new Product(title, imageUrl, description, price);
	}
	Product.save(product);
	res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
	const { id } = req.body;
	Product.deleteById(id, (err) => {
		if (err) {
			console.error(err);
		}
		res.redirect('/admin/products');
	});
};
