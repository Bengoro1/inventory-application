const pool = require('./pool');

async function getAllProducts() {
  const { rows } = await pool.query(`SELECT * FROM pc_components`);
  return rows;
}

module.exports = {
  getAllProducts
}