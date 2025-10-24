import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/20 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/20 text-shade-1 ${className}`}>
      {children}
    </div>
  );
};

export default Card;