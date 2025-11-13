import { cookies } from "next/headers";

export async function getSession(){
	const session = (await cookies()).get('session')?.value;
	if (!session) return null;

	try {
		return JSON.parse(session) as Session;
	} catch {
		return null;
	}
}