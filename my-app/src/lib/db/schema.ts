import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  description: text('description'),
});
