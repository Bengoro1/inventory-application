const db = require('../db/queries');

async function allCategoriesGet(req, res) {
  const categories = await db.getAllCategories();
  res.render('index', {
    title: 'Home',
    categories: categories
  });
}

async function componentGet(req, res) {
  const component = Object.keys(req.query).length > 0 ? await db.getFilteredItems(req.params.pc_component, req.query) : await db.getComponent(req.params.pc_component);
  const title = await db.getCategoryName(req.params.pc_component);
  const filterBarColumns = await db.getFilterBarColumns(req.params.pc_component);
  const filterBar = await Promise.all(
    filterBarColumns
      .filter(column => column.column_name != 'id')
      .map(column => db.getFilterBarRows(req.params.pc_component, column.column_name))
  );

  res.render('category', {
    title: title.name,
    component: component,
    filterBar: filterBar,
    component_url: req.params.pc_component
  });
}

async function productGet(req, res) {
  const product = await db.getProduct(req.params.pc_component, req.params.product);
  res.render('product', {
    title: product.name,
    product: product,
    component_url: req.params.pc_component
  });
}

module.exports = {
  allCategoriesGet,
  componentGet,
  productGet,
}