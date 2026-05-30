import { Router } from 'express'
import { ResgateController } from '../controllers/ResgateController'
import { authMiddleware, requireRole } from '../middlewares/authMiddleware'

const router = Router()

router.post('/', authMiddleware, requireRole('ALUNO'), ResgateController.resgatar)
router.get('/aluno/me', authMiddleware, requireRole('ALUNO'), ResgateController.byAlunoMe)
router.get('/empresa/me', authMiddleware, requireRole('EMPRESA_PARCEIRA'), ResgateController.byEmpresaMe)
router.get('/aluno/:id', authMiddleware, ResgateController.byAluno)
router.get('/empresa/:id', authMiddleware, ResgateController.byEmpresa)

export default router
