
import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "px-6 py-3 rounded-xl font-bold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-shade-1 disabled:opacity-50 disabled:cursor-not-allowed text-center";

  const variantClasses = {
    primary: 'bg-shade-2 text-shade-4 hover:bg-opacity-80 focus:ring-shade-2',
    secondary: 'bg-shade-1 text-shade-4 border border-shade-2 hover:bg-shade-2 focus:ring-shade-2',
    ghost: 'bg-transparent text-shade-2 hover:bg-shade-2/30 focus:ring-shade-2',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;