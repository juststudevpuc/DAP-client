export const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 print:hidden shrink-0">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none transition"
        title="Toggle Sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isSidebarOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </>
          ) : (
            <>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </>
          )}
        </svg>
      </button>
      <span className="ml-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Workspace Navigation
      </span>
    </header>
  );
};