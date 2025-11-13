import Nav from "@/components/nav"
import { getSession } from "@/lib/session"
import RegisterForm from "@/components/register-form";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Register(){
	const session = await getSession()

	if (session) {
		redirect('/');
	}

	return (
		<div>
			<div className="w-full bg-linear-to-r from-cyan-700/80 to-indigo-600/90">
				<Nav session={session} showUser={false}/>
			</div>
			<div className="flex flex-col min-h-screen items-center justify-center font-sans bg-linear-to-r from-cyan-900 to-indigo-700">
				<div className="w-full max-w-md bg-red">
					<RegisterForm />
					<div className="flex flex-col justify-between mt-4 gap-2 items-center">
						<Link
							href="/login"
							aria-label="login"
							className="text-white dark:text-black hover:scale-[1.015] duration-550"
						>
							Already have an account?{" "}
							<span className="font-bold">Login</span>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}