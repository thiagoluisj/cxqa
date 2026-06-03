import Link from 'next/link';

type Props = {
  showNewButton?: boolean;
};

export function Header({ showNewButton = true }: Props) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <span className="font-bold text-gray-900 text-lg tracking-tight">CXQA</span>
                <span className="hidden sm:block text-xs text-gray-400 -mt-0.5">UX Quality Assurance</span>
              </div>
            </Link>
          </div>

          {showNewButton && (
            <Link href="/nova" className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              <span>Nova Ocorrência</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
