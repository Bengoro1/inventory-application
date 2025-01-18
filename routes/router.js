const { Router } = require('express');
const controller = require('../controllers/controller');

const router = Router();

router.get('/', controller.allCategoriesGet);
router.get('/pc_component/:pc_component', controller.componentGet);
router.get('/pc_component/:pc_component/new', controller.productGetNew);
router.post('/pc_component/:pc_component/new', controller.productPostNew);
router.get('/pc_component/:pc_component/:product', controller.productGet);
router.post('/pc_component/:pc_component/:product/delete', controller.productDelete);

module.exports = router;