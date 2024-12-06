const { Router } = require('express');
const controller = require('../controllers/controller');

const router = Router();

router.get('/', controller.allCategoriesGet);
router.get('/pc_component/:pc_component', controller.componentGet);
router.get('/pc_component/:pc_component/:product', controller.productGet);

module.exports = router;