import MainNavigation from '@/components/MainNavigation';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function AILayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainNavigation />
      <div className="page-container">
        <Breadcrumbs />
        {children}
      </div>
    </>
  );
}
