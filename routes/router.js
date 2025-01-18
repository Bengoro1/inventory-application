const { Router } = require('express');
const controller = require('../controllers/controller');

const router = Router();

router.get('/', controller.allCategoriesGet);
router.get('/pc_component/:pc_component', controller.componentGet);
router.get('/pc_component/:pc_component/new', controller.productGetNew);
router.post('/pc_component/:pc_component/new', controller.productPostNew);
router.get('/pc_component/:pc_component/:product', controller.productGet);
router.post('/pc_component/:pc_component/:product/delete', controller.productDelete);
router.get('/pc_component/:pc_component/:product/update', controller.productUpdateGet);
router.post('/pc_component/:pc_component/:product/update', controller.productUpdatePost);

module.exports = router;