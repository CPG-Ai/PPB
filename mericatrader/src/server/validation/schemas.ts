import { z } from 'zod';

export const locationSchema = z.object({
	city: z.string().optional(),
	state: z.string().optional(),
	zip: z.string(),
	country: z.string().optional(),
});

export const attributesSchema = z.record(z.any());

export const createInventoryLotSchema = z.object({
	sku: z.string().optional(),
	upc: z.string().optional(),
	categoryPath: z.array(z.string()).optional(),
	condition: z.enum(['new', 'used', 'refurb', 'damaged']),
	attributes: attributesSchema.default({}),
	quantity: z.string().or(z.number()).transform((v) => v.toString()),
	unit: z.string().default('ea'),
	location: locationSchema,
	latitude: z.string().or(z.number()).optional().transform((v) => (v == null ? undefined : v.toString())),
	longitude: z.string().or(z.number()).optional().transform((v) => (v == null ? undefined : v.toString())),
	costCents: z.number().int().optional(),
});

export const createListingSchema = z.object({
	lotId: z.string().uuid(),
	title: z.string().min(3),
	description: z.string().optional(),
	media: z.array(z.object({ url: z.string().url(), alt: z.string().optional(), order: z.number().int().optional() })).default([]),
	priceCents: z.number().int().positive(),
	currency: z.literal('USD').default('USD'),
	categoryPath: z.array(z.string()).optional(),
	condition: z.enum(['new', 'used', 'refurb', 'damaged']),
});

export const publishListingSchema = z.object({});

