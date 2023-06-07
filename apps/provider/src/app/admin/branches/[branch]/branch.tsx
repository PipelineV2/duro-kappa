import Link from 'next/link';

export default function Branch({ branch } : { branch: string }) {
	return (
		<div className="hidden lg:block">
			this is a branch for branch: {branch}
		</div>
	);
}
