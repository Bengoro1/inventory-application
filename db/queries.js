const pool = require('./pool');

async function getAllCategories() {
  const { rows } = await pool.query(`SELECT * FROM pc_components`);
  return rows;
}

async function getComponent(component) {
  const { rows } = await pool.query(`SELECT * FROM ${component}`);
  return rows;
}

async function getCategoryName(category) {
  const { rows } = await pool.query(`SELECT name FROM pc_components WHERE url = $1;`, [category]);
  return rows[0];
}

async function getProduct(category, product) {
  const { rows } = await pool.query(`SELECT * FROM ${category} WHERE id = $1;`, [product]);
  return rows[0];
}

async function getFilterBarColumns(component) {
  const { rows } = await pool.query(`SELECT column_name
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = N'${component}';
  `);
  return rows;
}

async function getFilterBarRows(component, column) {
  const result = await pool.query(`SELECT DISTINCT ${column} FROM ${component};`);
  const values = result.rows.map(value => value[result.fields[0].name]);
  const row = {[result.fields[0].name]: values};
  return row;
}

async function getFilteredItems(component, query) {
  console.log('filtered items', component, query);
}

module.exports = {
  getAllCategories,
  getComponent,
  getCategoryName,
  getProduct,
  getFilterBarColumns,
  getFilterBarRows,
  getFilteredItems
}