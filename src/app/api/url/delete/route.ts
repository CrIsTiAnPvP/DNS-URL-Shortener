import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import client from "@/lib/cloudflare";

export async function POST(req: NextRequest){
	const { url, userId } = await req.json();

	const dbRecord = await prisma.url.findFirst({ where: { AND: [ { userId: userId }, { original: url } ] } })

	if (!dbRecord) return NextResponse.json({ message: "URL not found" }, { status: 404 })

	await client.dns.records.delete(dbRecord.dnsRecordID, { zone_id: process.env.CF_ZONE ? process.env.CF_ZONE : "" })

	await prisma.url.delete({
		where: {
			dnsRecordID: dbRecord.dnsRecordID
		}
	})
}