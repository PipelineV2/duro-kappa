import React from 'react';
type PropsType = {
	title: string
}

function Header({ title = "DURO" }: PropsType) {
	return (
		<div className="w-full py-3 px-5 text-center space-x-2">
			<span>{title}</span>
			<span>by team kappa</span>
		</div>
	)
}

export default Header;

