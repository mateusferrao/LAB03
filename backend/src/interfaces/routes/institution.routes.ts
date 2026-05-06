import { Router } from 'express'
import { InstitutionController } from '../controllers/InstitutionController'

const router = Router()

router.get('/', InstitutionController.list)

export default router
