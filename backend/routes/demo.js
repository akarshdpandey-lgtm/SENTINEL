import express from 'express';
import * as demoController from '../controllers/demoController.js';
import * as aiController from '../controllers/aiController.js';

const router = express.Router();

// Demo control endpoints
router.post('/start', demoController.startDemo);
router.get('/progress', demoController.getDemoProgress);
router.post('/stop', demoController.stopDemo);
router.post('/reset', demoController.resetDemo);

// Demo data endpoints
router.get('/notifications', demoController.getNotifications);
router.get('/campus-network', demoController.getCampusNetwork);

// AI analysis endpoints for demo
router.post('/analyze', aiController.analyzeEmergency);
router.post('/predict', aiController.generatePredictions);
router.post('/report', aiController.generateReport);

export default router;
