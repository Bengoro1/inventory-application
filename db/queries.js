const pool = require('./pool');

async function getAllCategories() {
  const { rows } = await pool.query(`SELECT * FROM pc_components`);
  return rows;
}

module.exports = {
  getAllCategories
}