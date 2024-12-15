import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface NavbarProps {
  title: string;
  onQueriesClick: () => void;
  onAddQueryClick: () => void;
}

const Navbar = ({ title, onQueriesClick, onAddQueryClick }: NavbarProps) => {
  const [user, setUser] = useState<string | null>(null); // Manage user role in state
  const [menuOpen, setMenuOpen] = useState(false); // Toggle menu for mobile
  const router = useRouter();

  // Load user role from localStorage in the browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser);
    }
  }, []);

  // Handle logout and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <nav className="bg-blue-500 text-white p-4 flex justify-between items-center">
      {/* Navbar Title */}
      <h1 className="text-xl font-bold">{title}</h1>

      {/* Hamburger Menu for Small Screens */}
      <button
        className="sm:hidden block text-white"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 5.25h16.5M3.75 12h16.5m-16.5 6.75h16.5"
          />
        </svg>
      </button>

      {/* Menu Items */}
      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } sm:flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto mt-4 sm:mt-0`}
      >
        {user === "student" ? (
          <>
            <button
              onClick={onQueriesClick}
              className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 focus:ring-2 focus:ring-green-300"
            >
              Your Queries
            </button>
            <button
              onClick={onAddQueryClick}
              className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 focus:ring-2 focus:ring-green-300"
            >
              Add Query
            </button>
          </>
        ) : user === "resolver" ? (
          <>
            <button
              onClick={onQueriesClick}
              className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 focus:ring-2 focus:ring-green-300"
            >
              Pending Queries
            </button>
            <button
              onClick={onAddQueryClick}
              className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 focus:ring-2 focus:ring-green-300"
            >
              Completed Queries
            </button>
          </>
        ) : (
          <p></p>
        )}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 focus:ring-2 focus:ring-red-300"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

