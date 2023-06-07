import Link from 'next/link';

export default function Queue({ business } : { business: string }) {
	return (
		<div className="hidden lg:block">
			this is a queue for business: {business}
		</div>
	);
}
