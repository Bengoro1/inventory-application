const db = require('../db/queries');

async function allCategoriesGet(req, res) {
  const categories = await db.getAllCategories();
  res.render('index', {
    title: 'Home',
    categories: categories
  });
}

async function componentGet(req, res) {
  const isRedirectNeeded = req._parsedUrl.query != null && req._parsedUrl.query.includes('%5B');
  const component = Object.keys(req.query).length == 0 ? await db.getComponent(req.params.pc_component) :
    !isRedirectNeeded ? await db.getFilteredItems(req.params.pc_component, req.query) : null;
  const title = await db.getCategoryName(req.params.pc_component);
  const filterBarColumns = await db.getFilterBarColumns(req.params.pc_component);
  const filterBar = await Promise.all(
    filterBarColumns
      .filter(column => column.column_name != 'id')
      .map(column => db.getFilterBarRows(req.params.pc_component, column.column_name))
  );

  if (isRedirectNeeded) {
    const transformedQuery = {};
    for (const [key, value] of Object.entries(req.query)) {
      if (value.from && value.to) {
        transformedQuery[key] = `${value.from}-${value.to}`;
      } else {
        transformedQuery[key] = value;
      }
    }

    const queryString = Object.entries(transformedQuery)
      .map(([key, value]) => `${key}=${encodeURIComponent(value).replace(/%20/g, '+')}`)
      .join('&')

    return res.redirect(`/pc_component/${req.params.pc_component}?${queryString}`);
  }

  res.render('category', {
    title: title.name,
    component: component,
    filterBar: filterBar,
    component_url: req.params.pc_component,
    query: req.query
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