import { Router } from 'express'
import { ProfessorController } from '../controllers/ProfessorController'
import { authMiddleware, requireRole } from '../middlewares/authMiddleware'

const router = Router()

router.use(authMiddleware, requireRole('PROFESSOR', 'EMPRESA_PARCEIRA'))

router.get('/', ProfessorController.list)
router.get('/:id', ProfessorController.getOne)
router.get('/:id/statement', ProfessorController.statement)
router.post('/credit-semester', ProfessorController.creditSemester)

export default router
