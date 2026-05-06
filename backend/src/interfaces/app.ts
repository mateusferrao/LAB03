import express from 'express'
import cors from 'cors'
import studentRoutes from './routes/student.routes'
import companyRoutes from './routes/company.routes'
import institutionRoutes from './routes/institution.routes'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/students', studentRoutes)
app.use('/companies', companyRoutes)
app.use('/institutions', institutionRoutes)

app.use(errorHandler)

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export default app
