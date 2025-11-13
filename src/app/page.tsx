import Nav from "@/components/nav";
import UrlForm from "@/components/url-form";
import { getSession } from "@/lib/session";

export default async function Home() {

  const session = await getSession();

  return (
    <div className="min-h-screen w-full bg-linear-to-r from-cyan-700/80 to-indigo-600/90">
      <Nav session={session} showUser={true}/>
      <div className="flex min-h-screen items-center justify-center font-sans bg-linear-to-r from-cyan-900 to-indigo-700"> 
        <UrlForm />
      </div>
    </div>
  );
}
