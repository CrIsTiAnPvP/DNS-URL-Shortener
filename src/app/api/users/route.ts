import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@/lib/auth";
import { PrismaClient } from "#/prisma/client";
import { hash } from "bcrypt"

const prisma = new PrismaClient()

export async function GET(res: NextApiResponse){
	const session = await getSession();
	if (!session) {
		res.status(403).json({ message: "No session Found" })
	} else {
		return res.status(200).json({ message: "Authorized", session})
	}
}

export async function POST(req: NextApiRequest, res: NextApiResponse){
	const { username, email, password } = req.body

	if (!username || !email || !password ){
		return res.status(404).json({ message: "Missing fields" })
	}

	const pwd = await hash(password, 10)

	const eUser = await prisma.user.findFirst({
		where: {
			OR: [ { email }, { username } ]
		}
	})

	if (eUser) {
		return res.status(404).json({ message: "User already exists" })
	} else {
		const user = await prisma.user.create({
			data: {
				username: username,
				email: email,
				password: pwd,
			}
		})

		return res.status(200).json({ message: "User created succesfully", userId: user.id })
	}

}