const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');
const { v4: uuidv4 } = require('uuid');
const { find, findIndex, reject } = require('lodash');

const p = path.join(rootDir, 'data', 'products.json');

const fetchProductsFromFile = (cb) => {
	fs.readFile(p, (err, data) => {
		if (data) {
			return cb(JSON.parse(data));
		}
		cb([]);
	});
};

const saveProductsIntoFile = (products) => {
	fs.writeFile(p, JSON.stringify(products), (err) => console.error(err));
};

module.exports = class Product {
	constructor(title, imageUrl, description, price) {
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	static save(product) {
		fetchProductsFromFile((products) => {
			const updatedProducts = [...products];
			if (product.id) {
				const index = findIndex(products, ['id', product.id]);
				updatedProducts[index] = product;
			} else {
				product.id = uuidv4();
				updatedProducts.push(product);
			}
			saveProductsIntoFile(updatedProducts);
		});
	}

	static findAll(cb) {
		fetchProductsFromFile(cb);
	}

	static findById(productId, cb) {
		fetchProductsFromFile((products) => {
			const product = find(products, ['id', productId]);
			cb(product);
		});
	}

	static deleteById(productId, cb) {
		fetchProductsFromFile((products) => {
			const index = findIndex(products, ['id', productId]);
			if (index == -1) {
				cb(new Error(`Product with id ${productId} not found.`));
			} else {
				const updatedProducts = reject(products, ['id', productId]);
				saveProductsIntoFile(updatedProducts);
				cb(null);
			}
		});
	}
};
