export const H1: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
  <h1 className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-4xl text-center ${className}`} {...props}>
    {children}
  </h1>
);