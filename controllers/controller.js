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

  const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;
  const params = new URLSearchParams(req.query);

  const urlWithoutOrder = new URL(baseUrl);
  params.forEach((value, key) => {
    if (key !== 'order') {
      urlWithoutOrder.searchParams.set(key, value);
    }
  });

  const urls = {
    default: urlWithoutOrder.toString(),
    name: `${urlWithoutOrder.toString()}${urlWithoutOrder.search ? '&' : '?'}order=name`,
    low: `${urlWithoutOrder.toString()}${urlWithoutOrder.search ? '&' : '?'}order=low`,
    high: `${urlWithoutOrder.toString()}${urlWithoutOrder.search ? '&' : '?'}order=high`,
  };

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
    query: req.query,
    transformString: transformString,
    urls: urls,
    order: req.query.order
  });
}

async function productGet(req, res) {
  const product = await db.getProduct(req.params.pc_component, req.params.product);
  const nameOrModel = await db.getNameOrModel(req.params.pc_component);
  res.render('product', {
    title: `${product.manufacturer} ${product[nameOrModel]}`,
    product: product,
    component_url: req.params.pc_component,
    transformString: transformString
  });
}

function transformString(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
    .split('_')
    .map(word => {
      if (word === 'mhz') return 'MHz';
      if (word === 'w') return 'W';
      if (word === 'rpm') return 'RPM';
      if (word === 'db') return 'dB';
      if (word === 'gb') return 'GB';
      if (word === 'ghz') return 'GHz';
      if (word === 'tb') return 'TB';
      return word;
    })
    .join(' ');
}

async function productGetNew(req, res) {
  const columns = await db.getColumns(req.params.pc_component);
  const filteredColumns = columns.filter(column => column.column_name != 'id');
  res.render('new', {
    title: `Add to ${req.params.pc_component}`,
    component_url: req.params.pc_component,
    columns: filteredColumns,
    transformString: transformString
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
  const nameOrModel = await db.getNameOrModel(req.params.pc_component);
  res.render('update', {
    title: `Update ${product.manufacturer} ${product[nameOrModel]}`,
    component_url: req.params.pc_component,
    product: product,
    columns: filteredColumns,
    transformString: transformString
  });
}

async function productUpdatePost(req, res) {
  await db.updateProductPost(req.params.pc_component, req.params.product, req.body);
  res.redirect(`/pc_component/${req.params.pc_component}/${req.params.product}`);
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