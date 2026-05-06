export interface IRepository<T, TCreate = T> {
  findById(id: string): Promise<T | null>
  findAll(): Promise<T[]>
  save(entity: TCreate): Promise<T>
  update(id: string, data: Partial<T>): Promise<T>
  delete(id: string): Promise<void>
}
