import { Link } from 'react-router-dom';
import { UtensilsCrossed, Leaf } from 'lucide-react';

interface MealMateLogoProps {
  className?: string;
  showText?: boolean;
  linkTo?: string;
}

export function MealMateLogo({ className = '', showText = true, linkTo = '/' }: MealMateLogoProps) {
  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="bg-primary-600 text-white p-1.5 rounded-lg flex items-center justify-center shrink-0">
        <UtensilsCrossed className="w-5 h-5" />
      </div>
      {showText && (
        <>
          <span className="font-bold text-xl text-gray-900">MealMate</span>
          <Leaf className="w-5 h-5 text-primary-600" />
        </>
      )}
    </div>
  );

  if (linkTo && linkTo !== '') {
    return <Link to={linkTo} className="inline-flex">{content}</Link>;
  }
  return <div className="inline-flex">{content}</div>;
}
