const db = require('../db/queries');

async function allProductsGet(req, res) {
  const products = await db.getAllProducts();
  res.render('index', {products: products});
}

module.exports = {
  allProductsGet
}