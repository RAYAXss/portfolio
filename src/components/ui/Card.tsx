import React from 'react';

interface CardProps {
  hover?: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  hover = false,
  className = '',
  onClick,
  children
}) => {
  const baseClasses = 'bg-white rounded-xl shadow-md transition-all duration-200';
  const hoverClasses = hover ? 'hover:-translate-y-1 hover:shadow-xl cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;