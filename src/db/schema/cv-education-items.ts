import { pgTable, text, uuid, integer, index } from 'drizzle-orm/pg-core'
import { cvs } from './cvs'

export const cvEducationItems = pgTable(
  'cv_education_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cvId: uuid('cv_id')
      .notNull()
      .references(() => cvs.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull().default(0),
    institution: text('institution').notNull().default(''),
    degree: text('degree').notNull().default(''),
    date: text('date').notNull().default(''),
    location: text('location').notNull().default(''),
    highlights: text('highlights').array().notNull().default([]),
  },
  (t) => [index('cv_education_items_cv_id_idx').on(t.cvId)],
)
