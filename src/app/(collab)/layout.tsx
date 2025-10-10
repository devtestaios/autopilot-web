import MainNavigation from '@/components/MainNavigation';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function CollabLayout({
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
