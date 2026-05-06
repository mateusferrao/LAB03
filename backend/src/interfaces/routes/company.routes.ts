import { Router } from 'express'
import { CompanyController } from '../controllers/CompanyController'

const router = Router()

router.get('/', CompanyController.list)
router.get('/:id', CompanyController.getOne)
router.post('/', CompanyController.create)
router.put('/:id', CompanyController.update)
router.delete('/:id', CompanyController.remove)

export default router
