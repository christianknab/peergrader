import AuthButton from "../components/AuthButton";
// import { useSearchParams } from 'next/navigation'; 

// export async function getCode() {
//   "use client";
//   const searchParams = useSearchParams();
//   const code = searchParams.get('code');
//   if (code) {
//     // Print the code to the console
//     console.log('Google sign-in code:', code);

//   }
// }
export default async function Index() {
  // getCode();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <AuthButton />
        </div>
      </nav>

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">

        <main className="flex-1 flex flex-col gap-6">
          <h2 className="font-bold text-4xl mb-4">Peer Grader</h2>

        </main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Footer
        </p>
      </footer>
    </div>
  );
}
