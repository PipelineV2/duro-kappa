
type Props = {
  children: React.ReactNode
  loading?: boolean
  text?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ loading, text, children, ...props }: Props) => {
  return (
    <button type="submit" className={"px-3 py-2 bg-white border border-black hover:shadow-outset "} {...props}>
      {loading ? "loading..." : children ?? text}
    </button>
  );
}

