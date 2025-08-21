import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/server/auth/options';
import { getDb } from '@/src/server/db';
import { userProfiles } from '@/src/server/db/schema/core';
import { eq } from 'drizzle-orm';

export async function GET() {
	const session = await getServerSession(authOptions);
	const user = session?.user as any;
	if (!user?.id) return NextResponse.json({ id: null, email: null, profile: null });
	const db = getDb();
	const profile = await db.select().from(userProfiles).where(eq(userProfiles.userId, user.id)).limit(1);
	return NextResponse.json({ id: user.id, email: user.email, profile: profile[0] ?? null });
}

