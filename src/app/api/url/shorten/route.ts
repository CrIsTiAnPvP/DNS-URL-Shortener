import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/lib/prisma";
import client from "@/lib/cloudflare";
import { randomInt } from "crypto";

export async function POST(req:NextRequest){
	var { url, userId } = await req.json();

	if (!userId) {
		userId = 99999
	}

	const cif = (await hash(url, 10)).slice(0, randomInt(10))

	const record = await client.dns.records.create({
		zone_id: process.env.CF_ZONE ? process.env.CF_ZONE : "",
		name: cif,
		ttl: 3600,
		type: 'TXT',
		content: url
	})

	await prisma.url.create({
		data: {
			userId: userId,
			dnsRecordID: record.id,
			createdAt: new Date(),
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
			original: url,
			short: cif,
		}
	})

	return NextResponse.json({ message: "DNS Record created sucessfully" }, { status: 200 });
}