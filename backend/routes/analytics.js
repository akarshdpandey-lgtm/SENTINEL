import express from 'express';
import * as analyticsController from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/predict', analyticsController.getPredictions);
router.get('/heatmap', analyticsController.getHeatmapData);
router.get('/zones', analyticsController.getZoneStats);
router.get('/', analyticsController.getAnalytics);

export default router;
