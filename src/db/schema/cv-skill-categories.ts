import { pgTable, text, uuid, integer, index } from 'drizzle-orm/pg-core'
import { cvs } from './cvs'

export const cvSkillCategories = pgTable(
  'cv_skill_categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cvId: uuid('cv_id')
      .notNull()
      .references(() => cvs.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull().default(0),
    name: text('name').notNull().default(''),
    values: text('values').notNull().default(''),
  },
  (t) => [index('cv_skill_categories_cv_id_idx').on(t.cvId)],
)
