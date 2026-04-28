import express from 'express';
import * as teamController from '../controllers/teamController.js';

const router = express.Router();

router.get('/', teamController.getTeams);
router.get('/status/load', teamController.getTeamLoadStatus);
router.get('/:type', teamController.getTeam);
router.post('/assign', teamController.assignTeam);
router.post('/backup', teamController.requestBackup);
router.put('/:type/members/:memberId', teamController.updateTeamMember);

export default router;
