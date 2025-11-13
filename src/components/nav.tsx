"use client";
import { redirect } from "next/navigation";

export default function Nav( {session, showUser}: {session: Session | null, showUser: boolean} ) {
	return (
		<nav className="flex min-w-max p-5">
			<div className="flex">
				<h1 className="text-2xl font-bold text-white dark:text-black hover:cursor-pointer" onClick={ () => redirect("/") }>DNS-URL Shortener</h1>
			</div>
			<div className="items-center ml-auto flex mt-1.5 mr-8	">
				{ session && showUser ? (
					<div>
						<span className="ml-4 text-white dark:text-black hover:cursor-pointer hover:scale-[1.05] transform duration-300" onClick={ () => redirect('/user')}>{ session.username }</span>
						<span className="ml-4 text-white dark:text-black hover:cursor-pointer hover:scale-[1.05] transform duration-300" onClick={ () => redirect('/user/urls')}>My URLs</span>
					</div>
				) : (
					showUser &&
					<span className="ml-4 font-medium text-white dark:text-black hover:cursor-pointer hover:scale-[1.05] transform duration-300 " onClick={ () => redirect("/login")}>Guest</span>
				) }
			</div>
			<div className="flex items-center gap-1 hover:cursor-pointer hover:scale-[1.05] transform duration-300" onClick={ () => redirect("https://github.com/CrIsTiAnPvP/DNS-URL-Shortener") }>
				<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mt-1 mr-1 fill-white dark:fill-black">
					<title>GitHub</title>
					<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
				</svg>
				<p className="font-medium text-white dark:text-black mt-1.5">Project Repo</p>
			</div>
		</nav>	
	)
}