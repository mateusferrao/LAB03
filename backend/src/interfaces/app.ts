import express from 'express'
import cors from 'cors'
import studentRoutes from './routes/student.routes'
import companyRoutes from './routes/company.routes'
import institutionRoutes from './routes/institution.routes'
import authRoutes from './routes/auth.routes'
import professorRoutes from './routes/professor.routes'
import transferRoutes from './routes/transfer.routes'
import vantagemRoutes from './routes/vantagem.routes'
import resgateRoutes from './routes/resgate.routes'
import leaderboardRoutes from './routes/leaderboard.routes'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

app.use(cors())
app.use(express.json())

// Public
app.use('/auth', authRoutes)
app.use('/institutions', institutionRoutes)
app.use('/leaderboard', leaderboardRoutes)
app.use('/vantagens', vantagemRoutes)

// Resource routes
app.use('/students', studentRoutes)
app.use('/companies', companyRoutes)
app.use('/professors', professorRoutes)
app.use('/transfers', transferRoutes)
app.use('/resgates', resgateRoutes)

app.use(errorHandler)

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
  console.log(`🏛️  Casa da Moeda API — http://localhost:${PORT}`)
})

export default app
