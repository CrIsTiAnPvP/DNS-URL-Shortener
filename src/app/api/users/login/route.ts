import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
	const { email, password } = await req.json();

	if (!email) return NextResponse.json({ message: "Email is required" }, { status: 400 });

	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) return NextResponse.json({ message: "Error, no user matching that email found!" }, { status: 401 });

	const pwd = await compare(password, user.password);
	if (!pwd) return NextResponse.json({ message: "Incorrect password" }, { status: 401 });
	
	(await cookies()).set(
		"session",
		JSON.stringify({ userId: user.id, username: user.username }),
		{
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			path: "/",
			maxAge: 60 * 60 * 24 * 2
		}
	);

	return NextResponse.json({ ok: true }, { status: 200 })
}