import { Router } from 'express'
import { ResgateController } from '../controllers/ResgateController'
import { authMiddleware, requireRole } from '../middlewares/authMiddleware'

const router = Router()

router.post('/', authMiddleware, requireRole('ALUNO'), ResgateController.resgatar)
router.get('/aluno/:id', authMiddleware, ResgateController.byAluno)
router.get('/empresa/:id', authMiddleware, ResgateController.byEmpresa)

export default router
