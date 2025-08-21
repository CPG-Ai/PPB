import { sql } from 'drizzle-orm';
import {
	pgTable,
	uuid,
	text,
	jsonb,
	integer,
	timestamp,
	pgEnum,
	boolean,
	numeric,
} from 'drizzle-orm/pg-core';

export const conditionEnum = pgEnum('condition', ['new', 'used', 'refurb', 'damaged']);
export const listingStatusEnum = pgEnum('listing_status', ['draft', 'active', 'paused', 'sold_out', 'ended']);
export const listingTypeEnum = pgEnum('listing_type', ['fixed']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'fulfilled', 'canceled']);
export const visibilityEnum = pgEnum('visibility', ['public', 'private']);

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const userProfiles = pgTable('user_profiles', {
	userId: uuid('user_id').primaryKey().references(() => users.id),
	displayName: text('display_name').notNull(),
	businessName: text('business_name'),
	phone: text('phone'),
	tradeSpecialties: text('trade_specialties').array(),
	address: jsonb('address'),
	latitude: numeric('latitude'),
	longitude: numeric('longitude'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const inventoryLots = pgTable('inventory_lots', {
	id: uuid('id').primaryKey().defaultRandom(),
	ownerId: uuid('owner_id').references(() => users.id).notNull(),
	sku: text('sku'),
	upc: text('upc'),
	categoryPath: text('category_path').array(),
	condition: conditionEnum('condition').notNull(),
	attributes: jsonb('attributes').notNull().default(sql`'{}'::jsonb`),
	quantity: numeric('quantity').notNull(),
	unit: text('unit').notNull().default('ea'),
	location: jsonb('location'),
	latitude: numeric('latitude'),
	longitude: numeric('longitude'),
	costCents: integer('cost_cents'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const listings = pgTable('listings', {
	id: uuid('id').primaryKey().defaultRandom(),
	lotId: uuid('lot_id').references(() => inventoryLots.id).notNull(),
	ownerId: uuid('owner_id').references(() => users.id).notNull(),
	title: text('title').notNull(),
	description: text('description'),
	media: jsonb('media').notNull().default(sql`'[]'::jsonb`),
	priceCents: integer('price_cents').notNull(),
	currency: text('currency').notNull().default('USD'),
	quantityAvailable: numeric('quantity_available').notNull().default('0'),
	listingType: listingTypeEnum('listing_type').notNull().default('fixed'),
	status: listingStatusEnum('status').notNull().default('draft'),
	categoryPath: text('category_path').array(),
	condition: conditionEnum('condition').notNull(),
	visibility: visibilityEnum('visibility').notNull().default('public'),
	startAt: timestamp('start_at', { withTimezone: true }).defaultNow(),
	endAt: timestamp('end_at', { withTimezone: true }),
});

export const inventoryMovements = pgTable('inventory_movements', {
	id: uuid('id').primaryKey().defaultRandom(),
	lotId: uuid('lot_id').references(() => inventoryLots.id).notNull(),
	refType: text('ref_type'),
	refId: uuid('ref_id'),
	delta: numeric('delta').notNull(),
	reason: text('reason'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const carts = pgTable('carts', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id').references(() => users.id).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const cartItems = pgTable('cart_items', {
	id: uuid('id').primaryKey().defaultRandom(),
	cartId: uuid('cart_id').references(() => carts.id).notNull(),
	listingId: uuid('listing_id').references(() => listings.id).notNull(),
	qty: numeric('qty').notNull(),
	unit: text('unit').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const orders = pgTable('orders', {
	id: uuid('id').primaryKey().defaultRandom(),
	buyerId: uuid('buyer_id').references(() => users.id).notNull(),
	subtotalCents: integer('subtotal_cents').notNull(),
	shippingCents: integer('shipping_cents').notNull().default(0),
	feeCents: integer('fee_cents').notNull().default(0),
	totalCents: integer('total_cents').notNull(),
	status: orderStatusEnum('status').notNull().default('pending'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
	id: uuid('id').primaryKey().defaultRandom(),
	orderId: uuid('order_id').references(() => orders.id).notNull(),
	listingId: uuid('listing_id').references(() => listings.id).notNull(),
	qty: numeric('qty').notNull(),
	unit: text('unit').notNull(),
	priceCents: integer('price_cents').notNull(),
});

export const watchlists = pgTable('watchlists', {
	userId: uuid('user_id').references(() => users.id).notNull(),
	listingId: uuid('listing_id').references(() => listings.id).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
	pk: { columns: [t.userId, t.listingId], isPrimaryKey: true },
}));

