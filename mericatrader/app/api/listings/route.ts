import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/src/server/db';
import { listings, inventoryMovements, inventoryLots } from '@/src/server/db/schema/core';
import { requireUser } from '@/src/server/auth/requireUser';
import { createListingSchema } from '@/src/server/validation/schemas';
import { and, eq, sql } from 'drizzle-orm';

export async function POST(req: NextRequest) {
	try {
		const user = await requireUser();
		const body = await req.json();
		const parsed = createListingSchema.safeParse(body);
		if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
		const v = parsed.data;
		const db = getDb();
		const lotRows = await db.select().from(inventoryLots).where(and(eq(inventoryLots.id, v.lotId), eq(inventoryLots.ownerId, user.id))).limit(1);
		if (!lotRows[0]) return NextResponse.json({ error: 'Lot not found' }, { status: 404 });
		const row = await db.insert(listings).values({
			lotId: v.lotId,
			ownerId: user.id,
			title: v.title,
			description: v.description,
			media: v.media as any,
			priceCents: v.priceCents,
			currency: v.currency,
			categoryPath: v.categoryPath,
			condition: v.condition,
			status: 'draft',
		}).returning();
		return NextResponse.json(row[0], { status: 201 });
	} catch (e: any) {
		if (e?.status) return e;
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}

export async function GET() {
	// simple index for now
	const db = getDb();
	const rows = await db.select().from(listings);
	return NextResponse.json(rows);
}

export async function PUT(req: NextRequest) {
	const user = await requireUser();
	const { id, publish } = await req.json();
	if (!id) return NextResponse.json({ error: 'id required' }, { status: 422 });
	if (publish) {
		// compute lot availability via movements
		const db = getDb();
		const lotIdRes = await db.select({ lotId: listings.lotId }).from(listings).where(and(eq(listings.id, id), eq(listings.ownerId, user.id))).limit(1);
		if (!lotIdRes[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
		const lotId = lotIdRes[0].lotId;
		const avail = await db
			.select({ sum: sql<string>`COALESCE(SUM(${inventoryMovements.delta}), '0')` })
			.from(inventoryMovements)
			.where(eq(inventoryMovements.lotId, lotId));
		const quantityAvailable = avail[0]?.sum ?? '0';
		const updated = await db
			.update(listings)
			.set({ status: 'active', quantityAvailable })
			.where(and(eq(listings.id, id), eq(listings.ownerId, user.id)))
			.returning();
		return NextResponse.json(updated[0]);
	}
	return NextResponse.json({ ok: true });
}

