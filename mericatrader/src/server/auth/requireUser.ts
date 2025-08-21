import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/server/auth/options';

export interface SessionUser { id: string; email: string }

export async function requireUser(): Promise<SessionUser> {
	const session = await getServerSession(authOptions);
	const u = session?.user as any;
	if (!u?.id || !u?.email) {
		throw NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) as unknown as Error;
	}
	return { id: u.id, email: u.email };
}

export function assertOwner(resourceOwnerId: string, userId: string) {
	if (resourceOwnerId !== userId) {
		throw new Error('Forbidden');
	}
}

