import { pgTable, text, uuid, integer, index } from 'drizzle-orm/pg-core'
import { cvs } from './cvs'

export const cvProjectItems = pgTable(
  'cv_project_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cvId: uuid('cv_id')
      .notNull()
      .references(() => cvs.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull().default(0),
    name: text('name').notNull().default(''),
    tech: text('tech').notNull().default(''),
    date: text('date').notNull().default(''),
    highlights: text('highlights').array().notNull().default([]),
  },
  (t) => [index('cv_project_items_cv_id_idx').on(t.cvId)],
)
