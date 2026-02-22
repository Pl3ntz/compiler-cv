import { pgTable, text, uuid, integer, index } from 'drizzle-orm/pg-core'
import { cvs } from './cvs'

export const cvLanguageItems = pgTable(
  'cv_language_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cvId: uuid('cv_id')
      .notNull()
      .references(() => cvs.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull().default(0),
    name: text('name').notNull().default(''),
    level: text('level').notNull().default(''),
  },
  (t) => [index('cv_language_items_cv_id_idx').on(t.cvId)],
)
