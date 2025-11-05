"use client";
import { redirect } from "next/navigation";

export default function Nav( {session}: {session?: Session} ) {
	return (
		<nav className="flex min-w-max p-5">
			<div>
				<h1 className="text-2xl font-bold text-black dark:text-white hover:cursor-pointer" onClick={ () => redirect("https://github.com/CrIsTiAnPvP/DNS-URL-Shortener") }>DNS-URL Shortener</h1>
			</div>
			<div className="items-center ml-auto flex mt-1.5">
				{ session ? (
					<div>
						<span className="ml-4 text-black dark:text-white hover:cursor-pointer hover:scale-[1.05] transform duration-300" onClick={ () => redirect('/user')}>{ session.username }</span>
						<span className="ml-4 text-black dark:text-white hover:cursor-pointer hover:scale-[1.05] transform duration-300" onClick={ () => redirect('/user/urls')}>My URLs</span>
					</div>
				) : (
					<span className="ml-4 font-medium text-black dark:text-white hover:cursor-pointer hover:scale-[1.05] transform duration-300 " onClick={ () => redirect("/login")}>Guest</span>
				) }
			</div>
		</nav>
	)
}