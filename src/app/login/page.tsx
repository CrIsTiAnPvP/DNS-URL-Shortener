import Nav from "@/components/nav"
import { getSession } from "@/lib/session"
import LoginForm from "@/components/login-form";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input"
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Login(){

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
          <LoginForm />
          <div className="flex flex-col justify-between mt-4 gap-2 items-center">
            <Link
              href="/register"
              aria-label="register"
              className="text-white dark:text-black hover:scale-[1.015] duration-550"
            >
              Doesn't have an account yet?{" "}
              <span className="font-bold">Register</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}