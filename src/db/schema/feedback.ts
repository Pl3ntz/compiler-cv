import { pgTable, text, timestamp, uuid, integer, index } from 'drizzle-orm/pg-core'

export const feedback = pgTable(
  'feedback',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    type: text('type').notNull(),
    rating: integer('rating').notNull(),
    message: text('message').notNull().default(''),
    contactEmail: text('contact_email'),
    ipAddress: text('ip_address'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [
    index('feedback_created_at_idx').on(t.createdAt),
    index('feedback_type_idx').on(t.type),
  ],
)
