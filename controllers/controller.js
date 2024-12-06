const db = require('../db/queries');

async function allCategoriesGet(req, res) {
  const categories = await db.getAllCategories();
  res.render('index', {
    title: 'Home',
    categories: categories
  });
}

async function componentGet(req, res) {
  const component = await db.getComponent(req.params.pc_component);
  const title = await db.getCategoryName(req.params.pc_component);
  res.render('category', {
    title: title[0].name,
    component: component
  });
}

async function productGet(req, res) {
  const product = await db.getProduct(req.params.pc_component, req.params.product);
  res.render('product', {
    product: product
  });
}

module.exports = {
  allCategoriesGet,
  componentGet,
  productGet
}