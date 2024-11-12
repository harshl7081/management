import { Link, useNavigate } from "react-router-dom";
import logoimg from "../assets/EduProjectLog.png";
import { useUser } from "../Context/UserContext";
import { useEffect } from "react";

export const Navbar = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
    if (localStorage.getItem("token") === null) {
      navigate("/login");
    }
  }, [navigate, user]);

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src={logoimg} className="h-10 " alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              EduProjectLog
            </span>
          </Link>
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900 dark:text-white">
                {user && user.username ? user.username : "User Name"}
              </span>
              <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                {user && user.email ? user.email : "User Email"}
              </span>
            </div>
            <label
              className=" px-4 gap-2 rounded-lg py-2 shadow-lg text-sm font-semibold text-gray-700 flex hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
            
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
                />
              </svg>
              Sign out
            </label>
            {/* <!-- User profile dropdown --> */}
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {/* <li>
                <Link
                  to="/"
                  className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                  aria-current="page"
                >
                  Home
                </Link>
              </li> */}
              <li>
                {/* <Link
                  to="/"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Projects
                </Link> */}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
