import Link from 'next/link';

export default function Page() {
  return (
    <div className="hidden lg:block">
      <div className=""><Link href={`/admin/dashboard/1`}>one</Link></div>
      <div className=""><Link href={`/admin/dashboard/2`}>two</Link></div>
    </div>
  );
}
