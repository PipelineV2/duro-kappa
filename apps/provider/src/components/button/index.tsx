
type Props = {
	children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, ...props }: Props) => {
	return (
		<button {...props}>
			{children}
		</button>
	);
}

