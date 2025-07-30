import React from 'react';
import { IconChartBar } from './Icon';

export const Header: React.FC = () => {
  return (
    <header className="bg-brand-primary/30 py-4 shadow-md">
      <div className="container mx-auto px-4 md:px-8 flex items-center">
        <IconChartBar className="w-8 h-8 text-brand-secondary" />
        <h1 className="ml-3 text-2xl font-bold text-white tracking-wide">
          Sentiment Analysis Dashboard
        </h1>
      </div>
    </header>
  );
};
