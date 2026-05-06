import { Router } from 'express'
import { StudentController } from '../controllers/StudentController'

const router = Router()

router.get('/', StudentController.list)
router.get('/:id', StudentController.getOne)
router.post('/', StudentController.create)
router.put('/:id', StudentController.update)
router.delete('/:id', StudentController.remove)

export default router
