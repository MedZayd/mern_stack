const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');
const { findIndex } = require('lodash');

const p = path.join(rootDir, 'data', 'cart.json');

const fetchCartFromFile = (cb) => {
	fs.readFile(p, (err, fileContent) => {
		if (err) {
			cb({ products: [], totalPrice: 0 });
		} else {
			cb(JSON.parse(fileContent));
		}
	});
};

module.exports = class Cart {
	static addProduct(product) {
		fetchCartFromFile((cart) => {
			const index = findIndex(cart.products, ['id', product.id]);
			let updatedProduct = { id: product.id, quantity: 1 };
			if (index > -1) {
				updatedProduct = {
					...cart.products[index],
					quantity: cart.products[index].quantity + 1,
				};
				cart.products = [...cart.products];
				cart.products[index] = updatedProduct;
			} else {
				cart.products = [...cart.products, updatedProduct];
			}
			cart.totalPrice = cart.totalPrice + parseInt(product.price, 10);
			fs.writeFile(p, JSON.stringify(cart), (err) => {
				console.error(err);
			});
		});
	}
};
