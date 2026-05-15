import { Router } from 'express'
import { VantagemController } from '../controllers/VantagemController'
import { authMiddleware, requireRole } from '../middlewares/authMiddleware'

const router = Router()

router.get('/', VantagemController.listAll)
router.get('/empresa/:empresaId', VantagemController.listByEmpresa)
router.post('/empresa/:empresaId', authMiddleware, requireRole('EMPRESA_PARCEIRA'), VantagemController.create)
router.put('/:id', authMiddleware, requireRole('EMPRESA_PARCEIRA'), VantagemController.update)
router.delete('/:id', authMiddleware, requireRole('EMPRESA_PARCEIRA'), VantagemController.remove)

export default router
