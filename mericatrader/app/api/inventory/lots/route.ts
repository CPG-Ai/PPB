import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/src/server/db';
import { inventoryLots, inventoryMovements } from '@/src/server/db/schema/core';
import { requireUser } from '@/src/server/auth/requireUser';
import { createInventoryLotSchema } from '@/src/server/validation/schemas';

export async function GET() {
	const db = getDb();
	const lots = await db.select().from(inventoryLots);
	return NextResponse.json(lots);
}

export async function POST(req: NextRequest) {
	try {
		const user = await requireUser();
		const body = await req.json();
		const parsed = createInventoryLotSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json({ errors: parsed.error.flatten() }, { status: 422 });
		}
		const v = parsed.data;
		const db = getDb();
		const inserted = await db.insert(inventoryLots).values({
			ownerId: user.id,
			sku: v.sku,
			upc: v.upc,
			categoryPath: v.categoryPath,
			condition: v.condition,
			attributes: v.attributes as any,
			quantity: v.quantity,
			unit: v.unit,
			location: v.location as any,
			latitude: v.latitude,
			longitude: v.longitude,
			costCents: v.costCents,
		}).returning();
		const lot = inserted[0];
		await db.insert(inventoryMovements).values({ lotId: lot.id, delta: v.quantity, reason: 'init' });
		return NextResponse.json(lot, { status: 201 });
	} catch (e: any) {
		if (e?.status) return e;
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}

