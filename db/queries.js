const pool = require('./pool');

async function getAllCategories() {
  const { rows } = await pool.query(`SELECT * FROM pc_components`);
  return rows;
}

async function getComponent(component) {
  const { rows } = await pool.query(`SELECT * FROM ${component} ORDER BY id`);
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
  const query = `SELECT column_name, data_type, ordinal_position
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = $1
    ORDER BY ordinal_position;
  `;
  const { rows } = await pool.query(query, [component]);
  return rows;
}

async function getFilterBarRows(component, column) {
  const result = await pool.query(`SELECT DISTINCT ${column} FROM ${component};`);
  const values = result.rows.map(value => value[result.fields[0].name]);
  const row = {[result.fields[0].name]: values};
  return row;
}

async function getNameOrModel(component) {
  const query = `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = $1 AND column_name IN ('name', 'model');
  `;
  const { rows } = await pool.query(query, [component]);
  return rows[0].column_name;
}

async function getFilteredItems(component, query) {
  let queryString = `SELECT * FROM ${component} `;
  const conditions = [];
  const values = [];
  let order;

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
      } else if (key === 'order') {
        if (value === 'name') {
          order = await getNameOrModel(component);
        } else if (value === 'low') {
          order = 'price'
        } else if (value === 'high') {
          order = 'price DESC'
        }
      } else {
        conditions.push(`${key} = $${values.length + 1}`);
        values.push(value);
      }
    }
  }

  if (conditions.length > 0) {
    queryString += 'WHERE ' + conditions.join(' AND ');
  }
  
  const { rows } = await pool.query(queryString + ` ORDER BY ${order || 'id'};`, values);
  return rows;
}

async function newProductPost(component, data) {
  const values = [];
  const columnNames = [];
  const placeholders = [];

  for (const key in data) {
    values.push(data[key] || null);
    columnNames.push(key);
    placeholders.push(`$${values.length}`);
  } 

  await pool.query(`INSERT INTO ${component} (${columnNames.join(', ')}) VALUES (${placeholders.join(', ')});`, values);
}

async function deleteProduct(component, product) {
  await pool.query(`DELETE FROM ${component} WHERE id = $1;`, [product]);
}

async function updateProductPost(component, product_id, data) {
  const values = [];
  values.push(product_id);
  const conditions = [];

  for (const key in data) {
    values.push(data[key]);
    conditions.push(`${key} = $${values.length}`);
  }
  await pool.query(`UPDATE ${component} SET ${conditions.join(', ')} WHERE id = $1;`, values);
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
  deleteProduct,
  updateProductPost
}