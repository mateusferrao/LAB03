import { Router } from 'express'
import { ProfessorController } from '../controllers/ProfessorController'
import { authMiddleware, requireRole } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', ProfessorController.list)
router.get('/:id', ProfessorController.getOne)
router.get('/:id/statement', authMiddleware, ProfessorController.statement)
router.post('/credit-semester', authMiddleware, requireRole('PROFESSOR', 'EMPRESA_PARCEIRA'), ProfessorController.creditSemester)

export default router
