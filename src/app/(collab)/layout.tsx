import UnifiedNavigation from '@/components/UnifiedNavigation';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function CollabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UnifiedNavigation variant="app" />
      <div className="page-container">
        <Breadcrumbs />
        {children}
      </div>
    </>
  );
}
