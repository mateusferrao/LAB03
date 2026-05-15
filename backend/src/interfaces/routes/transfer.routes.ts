import { Router } from 'express'
import { TransferController } from '../controllers/TransferController'
import { authMiddleware, requireRole } from '../middlewares/authMiddleware'

const router = Router()

router.post('/', authMiddleware, requireRole('PROFESSOR'), TransferController.send)
router.get('/professor/:id', authMiddleware, TransferController.byProfessor)
router.get('/aluno/:id', authMiddleware, TransferController.byAluno)

export default router
