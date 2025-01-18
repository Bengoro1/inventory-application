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
  const filterBarColumns = await db.getColumns(req.params.pc_component);
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

function transformString(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
    .split('_')
    .map(word => {
      if (word === 'mhz') return 'MHz';
      if (word === 'w') return 'W';
      return word;
    })
    .join(' ');
}

console.log(transformString('boost_clock_mhz'));

async function productGetNew(req, res) {
  const columns = await db.getColumns(req.params.pc_component);
  const filteredColumns = columns.filter(column => column.column_name != 'id');
  res.render('new', {
    title: `New ${req.params.pc_component}`,
    component_url: req.params.pc_component,
    columns: filteredColumns
  });
}

async function productPostNew(req, res) {
  await db.newProductPost(req.params.pc_component, req.body);
  res.redirect(`/pc_component/${req.params.pc_component}`);
}

async function productDelete(req, res) {
  await db.deleteProduct(req.params.pc_component, req.params.product);
  res.redirect(`/pc_component/${req.params.pc_component}`);
}

async function productUpdateGet(req, res) {
  const product = await db.getProduct(req.params.pc_component, req.params.product);
  const columns = await db.getColumns(req.params.pc_component);
  const filteredColumns = columns.filter(column => column.column_name != 'id');
  res.render('update', {
    title: `Update ${product.name}`,
    component_url: req.params.pc_component,
    product: product,
    columns: filteredColumns
  });
}

async function productUpdatePost(req, res) {
  await db.updateProductPost(req.body);
}

module.exports = {
  allCategoriesGet,
  componentGet,
  productGet,
  transformString,
  productGetNew,
  productPostNew,
  productDelete,
  productUpdateGet,
  productUpdatePost
}

// implement transformString
// more terms for transform string
// create, delete and edit a product
// CSS

// odin/node/forms