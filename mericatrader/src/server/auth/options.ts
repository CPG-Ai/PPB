import type { NextAuthOptions, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { getDb } from '@/src/server/db';
import { users, userProfiles } from '@/src/server/db/schema/core';
import { eq } from 'drizzle-orm';

export const authOptions: NextAuthOptions = {
	session: { strategy: 'jwt' },
	providers: [
		Credentials({
			name: 'Email',
			credentials: { email: { label: 'Email', type: 'email' } },
			async authorize(credentials): Promise<User | null> {
				const email = credentials?.email?.toLowerCase().trim();
				if (!email) return null;
				const db = getDb();
				const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
				let user = existing[0];
				if (!user) {
					const inserted = await db.insert(users).values({ email }).returning();
					user = inserted[0];
					await db.insert(userProfiles).values({ userId: user.id, displayName: email.split('@')[0] });
				}
				return { id: user.id, email: user.email } as User;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = (user as any).id;
				token.email = user.email;
			}
			return token;
		},
		async session({ session, token }) {
			(session.user as any) = { id: token.id, email: token.email };
			return session;
		},
	},
};

