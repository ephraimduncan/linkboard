import Link from "next/link";

export default function NotFound() {
  return (
    <div className="items-center flex justify-center flex-col h-screen">
      <h2 className="text-lg mb-2 font-semibold">you&apos;re early</h2>
      <Link href="/dashboard">give me a few days</Link>
    </div>
  );
}
