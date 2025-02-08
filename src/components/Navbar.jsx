import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logocc.png"
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <nav className="container flex items-center mx-auto py-2 sm:py-4 sm:sticky">
      <Link to={'/'}><img src={Logo} alt="Logo" className="h-[150px] w-[150px]" /></Link>
      <ul className="hidden sm:flex flex-1 justify-end items-center text-bookmark-blue text-sm gap-12 uppercase font-semibold">
        <Link to={'/'}><li>Home</li></Link>
        <Link to={'/'}><li>Features</li></Link>
        <Link to={'/'}><li>About</li></Link>
        {isAuthenticated ? (
          <button 
            onClick={handleLogout}
            className="bg-cc-dblue text-white uppercase py-3 px-7 rounded-md hover:bg-blue-700"
          >
            Logout
          </button>
        ) : (
          <Link to="/login">
            <button className="bg-cc-dblue text-white uppercase py-3 px-7 rounded-md hover:bg-blue-700">
              Login
            </button>
          </Link>
        )}
      </ul>
      <div className="sm:hidden flex flex-1 justify-end px-2">
        <GiHamburgerMenu className="text-3xl" />
      </div>
    </nav>
  );
}

export default Navbar