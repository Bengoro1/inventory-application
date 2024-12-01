const db = require('../db/queries');

async function allCategoriesGet(req, res) {
  const products = await db.getAllCategories();
  res.render('index', {products: products});
}

module.exports = {
  allCategoriesGet
}