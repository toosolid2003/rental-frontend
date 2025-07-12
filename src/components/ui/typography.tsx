export const H1: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
  <h1 className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-4xl text-center ${className}`} {...props}>
    {children}
  </h1>
);

export const H3: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
  <h1 className={`text-indigo-600 text-base font-semibold leading-[22px] tracking-tight ${className}`} {...props}>
    {children}
  </h1>
);