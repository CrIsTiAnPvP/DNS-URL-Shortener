import { PrismaClient } from "#/prisma/client";
import { compare } from "bcrypt";
import { cookies } from "next/headers";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new Prisma

export async function POST(req: NextApiRequest, res: NextApiResponse){
	const { email, password } = req.body;

	const user = await 

}