import { Router } from 'express'
import { CompanyController } from '../controllers/CompanyController'
import { authMiddleware, requireRole } from '../middlewares/authMiddleware'

const router = Router()

router.use(authMiddleware, requireRole('PROFESSOR', 'EMPRESA_PARCEIRA'))

router.get('/', CompanyController.list)
router.get('/:id', CompanyController.getOne)
router.post('/', CompanyController.create)
router.put('/:id', CompanyController.update)
router.delete('/:id', CompanyController.remove)

export default router
