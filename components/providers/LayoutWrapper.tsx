'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/landingpage/Header';
import Footer from '@/components/landingpage/Footer';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  // Routes that should not have header and footer
  const excludedRoutes = ['/founder', '/investor'];
  
  // Check if current path starts with any excluded route
  const shouldExcludeHeaderFooter = excludedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (shouldExcludeHeaderFooter) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
