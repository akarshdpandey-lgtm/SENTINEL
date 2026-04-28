import express from 'express';
import * as emergencyController from '../controllers/emergencyController.js';
import { requestValidator } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requestValidator, emergencyController.createEmergency);
router.get('/', emergencyController.getEmergencies);
router.get('/stats', emergencyController.getEmergencyStats);
router.get('/:id', emergencyController.getEmergency);
router.put('/:id', emergencyController.updateEmergency);
router.delete('/:id', emergencyController.deleteEmergency);

export default router;
