import { relations } from "drizzle-orm/relations";
import { adminUsers, sessions } from "./schema";

export const sessionsRelations = relations(sessions, ({one}) => ({
	adminUser: one(adminUsers, {
		fields: [sessions.userId],
		references: [adminUsers.id]
	}),
}));

export const adminUsersRelations = relations(adminUsers, ({many}) => ({
	sessions: many(sessions),
}));