import Nav from "@/components/nav"
import { getSession } from "@/lib/session"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
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
		<form action="/api/users/login" method="POST">
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel
                    htmlFor="email"
                    className="text-white dark:text-black"
                  >
                    E-Mail
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="cristianpvp@cristianac.es"
                    className="placeholder:text-gray-200 placeholder:dark:text-black text-white dark:text-black"
					required
					aria-required={true}
                  />
                </Field>
                <Field>
                  <FieldLabel
                    htmlFor="password"
                    className="text-white dark:text-black"
                  >
                    Password
                  </FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="placeholder:text-gray-200 placeholder:dark:text-black text-white dark:text-black"
					required
					aria-required={true}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
            <div className="flex flex-col justify-between mt-4 gap-2 items-center">
              <button className="px-4 py-2 font-semibold text-white bg-blue-600/50 rounded hover:bg-blue-700/70 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:cursor-pointer active:scale-[0.975] transform duration-100">
                Login
              </button>
              <Link
                href="/register"
                aria-label="register"
                className="text-white dark:text-black hover:scale-[1.015] duration-550"
              >
                Doesn't have an account yet?{" "}
                <span className="font-bold">Register</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}