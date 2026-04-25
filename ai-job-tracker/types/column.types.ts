import { z } from 'zod'
import {
  createColumnSchema,
  updateColumnSchema,
} from '@/lib/validations/column.schema'
import { IColumn } from '@/models/Column.model'

export type CreateColumnInput = z.infer<typeof createColumnSchema>
export type UpdateColumnInput = z.infer<typeof updateColumnSchema>

export type Column = Omit<IColumn, '_id' | 'userId'> & {
  _id: string
  userId: string
}
