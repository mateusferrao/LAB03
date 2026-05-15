import { Router } from 'express'
import { StudentController } from '../controllers/StudentController'
import { authMiddleware, requireRole } from '../middlewares/authMiddleware'

const router = Router()

router.use(authMiddleware, requireRole('PROFESSOR', 'EMPRESA_PARCEIRA'))

router.get('/', StudentController.list)
router.get('/:id', StudentController.getOne)
router.post('/', StudentController.create)
router.put('/:id', StudentController.update)
router.delete('/:id', StudentController.remove)

export default router
