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
  const baseClasses = 'bg-gray-800 rounded-xl shadow-xl transition-all duration-200 border border-gray-700';
  const hoverClasses = hover ? 'hover:-translate-y-1 hover:shadow-2xl hover:border-gray-600 cursor-pointer' : '';

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