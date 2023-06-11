export type ButtonProps = {
  children?: React.ReactNode
  loading?: boolean
  text?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ loading, text, children, className, ...props }: ButtonProps) => {
  return (
    <button type="submit" className={`${className} px-3 py-2 bg-white border border-black hover:shadow-outset`} {...props}>
      {loading ? "loading..." : children ?? text}
    </button>
  );
}

