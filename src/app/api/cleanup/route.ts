import prisma from "@/lib/prisma";
import client from "@/lib/cloudflare";
import { NextResponse } from "next/server";

export async function DELETE(){
	const expiredDns = await prisma.url.findMany({ where: { expiresAt: { lt: new Date() } } });

	for (let l of expiredDns){
		await client.dns.records.delete(l.dnsRecordID, {
			zone_id: process.env.CF_ZONE ? process.env.CF_ZONE : ""
		})

		await prisma.url.delete({ where: { id: l.id } })
	}

	return NextResponse.json({ ok: true, eliminados: expiredDns, cantidad: expiredDns.length }, { status: 200 })
}