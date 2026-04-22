import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // detect screen size only
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      // sync sidebar state ONLY when switching between mobile/desktop
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // toggle sidebar (mobile only behavior)
  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen((prev) => !prev);
    }
  };

  // close sidebar (used when clicking outside / nav click)
  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div
      className="min-h-screen flex transition-all duration-300"
      style={{ backgroundColor: "var(--main-bg)" }}
    >
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Content */}
        <main className="flex-1 overflow-auto relative">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, var(--primary) 0%, transparent 50%), 
                             radial-gradient(circle at 80% 20%, var(--accent-primary) 0%, transparent 50%)`,
              pointerEvents: "none",
            }}
          ></div>
          <div className="relative py-6 sm:py-8 px-4 sm:px-6 lg:px-8 xl:px-10 max-w-7xl mx-auto">
            <div className="animate-fadeIn">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
