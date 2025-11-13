import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { hash } from "bcrypt";

export async function GET(){
	const session = await getSession();
	if (!session) {
		return NextResponse.json({ message: "No session Found" }, { status: 403 });
	} else {
		return NextResponse.json({ message: "Authorized", session}, { status: 200 });
	}
}

export async function POST(req: NextRequest){
	const data = await req.json();
	const { username, email, password } = data;

	console.log(data)

	if (!username || !email || !password ){
		return NextResponse.json({ message: "Missing fields" }, { status: 404 });
	}

	const pwd = await hash(password, 10)

	const eUser = await prisma.user.findFirst({
		where: {
			OR: [ { email }, { username } ]
		}
	})

	if (eUser) {
		return NextResponse.json({ message: "User already exists" }, { status: 409 });
	} else {
		const user = await prisma.user.create({
			data: {
				username: username,
				email: email,
				password: pwd,
			}
		})

		return NextResponse.json({ message: "User created succesfully", userId: user.id }, { status: 200 });
	}

}