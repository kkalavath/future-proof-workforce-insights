
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dashboard-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-dashboard-primary">404</h1>
        <p className="text-xl text-dashboard-text mb-4">Oops! Page not found</p>
        <p className="text-dashboard-muted mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <a href="/" className="bg-dashboard-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
          Return to Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
