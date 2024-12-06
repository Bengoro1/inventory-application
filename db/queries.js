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
  const { rows } = await pool.query(`SELECT name FROM pc_components WHERE url = $1`, [category]);
  return rows;
}

async function getProduct(category, product) {
  const { rows } = await pool.query(`SELECT * FROM ${category} WHERE id = $1`, [product]);
  return rows;
}

module.exports = {
  getAllCategories,
  getComponent,
  getCategoryName,
  getProduct
}