import { House } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import backgroundImage from '/businessmen-shaking-hands.png';

function AuthPageWrapper({ children }) {
  const bgRef = useRef(null);

  // Preload the background image
  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      if (bgRef.current) {
        bgRef.current.style.opacity = '1';
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-y-auto">
      {/* Fixed background */}
      <div
        ref={bgRef}
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-300 opacity-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
          zIndex: -1,
          backgroundAttachment: 'fixed',
          willChange: 'transform'
        }}
      />

      {/* Persistent home button */}
      <Link 
        to="/" 
        className="fixed top-6 left-6 z-50 p-2 rounded-full bg-white/80 hover:bg-white shadow-md hover:shadow-lg transition-all backdrop-blur-sm"
        aria-label="Return to home"
      >
        <House className="w-5 h-5 text-gray-800" />
      </Link>

      {/* Content container */}
      <div className="w-full max-w-md px-4 py-8 my-8 mx-auto">
        {children}
      </div>
    </div>
  );
}

export default AuthPageWrapper;