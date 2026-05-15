import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()

router.post('/login', AuthController.login)
router.post('/register/aluno', AuthController.registerAluno)
router.post('/register/empresa', AuthController.registerEmpresa)
router.get('/me', authMiddleware, AuthController.me)

export default router
