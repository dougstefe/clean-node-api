export interface LogErrorRepository {
  log (error: Error): Promise<void>
}
