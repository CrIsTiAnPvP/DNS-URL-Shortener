import Nav from "@/components/nav";

export default function Home() {

  const session = undefined

  return (
    <div className="min-h-screen w-full bg-white dark:bg-linear-to-r from-cyan-700/80 to-indigo-600/90">
      <Nav session={session}/>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-linear-to-r from-cyan-900 to-indigo-700">
      </div>
    </div>
  );
}
