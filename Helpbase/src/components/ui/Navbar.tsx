import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl text-amber-700">
          HelpBase
        </Link>
        <div className="space-x-4">
          <Link href="/auth/login" className="text-sm text-slate-600">
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm text-white bg-blue-600 px-3 py-1 rounded"
          >
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
}
