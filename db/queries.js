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

async function getColumns(component) {
  const { rows } = await pool.query(`SELECT column_name, data_type
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
  let queryString = `SELECT * FROM ${component} WHERE `;
  const conditions = [];
  const values = [];

  for (const [key, value] of Object.entries(query)) {
    if (value.includes('-')) {
      const [min, max] = value.split('-').map(Number);
      conditions.push(`${key} BETWEEN $${values.length + 1} AND $${values.length + 2}`);
      values.push(min, max);
    } else if (value.includes(',')) {
      const items = value.split(',').map((v) => v.trim());
      if ((key === 'socket' && component === 'coolers') || (key === 'motherboard_form_factor' && component === 'cases')) {
        conditions.push(`${key} && $${values.length + 1}`);
        values.push(items);
      } else {
        const placeholders = items.map((_, index) => `$${values.length + index + 1}`).join(', ');
        conditions.push(`${key} IN (${placeholders})`);
        values.push(...items);
      }
    } else {
      if ((key === 'socket' && component === 'coolers') || (key === 'motherboard_form_factor' && component === 'cases')) {
        conditions.push(`${key} @> ARRAY[$${values.length + 1}]::TEXT[]`);
        values.push(value);
      } else {
        conditions.push(`${key} = $${values.length + 1}`);
        values.push(value);
      }
    }
  }

  queryString += conditions.join(' AND ');

  const { rows } = await pool.query(queryString, values);
  return rows;
}

async function newProductPost(component, data) {
  let queryString = `INSERT INTO ${component} `;
  const values = [];

  await pool.query(queryString, values);
}

async function deleteProduct(component, product) {
  await pool.query(`DELETE FROM ${component} WHERE id = $1;`, [product]);
}

module.exports = {
  getAllCategories,
  getComponent,
  getCategoryName,
  getProduct,
  getColumns,
  getFilterBarRows,
  getFilteredItems,
  newProductPost,
  deleteProduct
}