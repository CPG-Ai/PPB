import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/src/server/db';
import { listings } from '@/src/server/db/schema/core';
import { eq } from 'drizzle-orm';

export async function GET(
	_req: NextRequest,
	{ params }: { params: { id: string } }
) {
	const db = getDb();
	const data = await db.select().from(listings).where(eq(listings.id, params.id)).limit(1);
	if (!data[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
	return NextResponse.json(data[0]);
}

