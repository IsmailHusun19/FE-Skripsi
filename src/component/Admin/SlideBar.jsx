import { ChevronDown, Menu } from "lucide-react";
import logo from "../../assets/logo.svg";
import { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarContext } from "./SidebarContextProvider";
import { Link } from "react-router-dom";

export default function Sidebar({ children }) {
  const { expanded, setExpanded } = useContext(SidebarContext);

  return (
<aside
  className={`h-screen fixed z-10 bg-white border-r shadow-sm flex flex-col transition-all duration-300 overflow-y-auto
    ${expanded ? "sm:w-[17rem] w-full" : "w-16"} 
  `}
>
      <nav className="flex flex-col h-full ">
        <div className="p-4 pb-2 flex justify-between items-center mb-5">
          <img
            src={logo}
            alt="Logo"
            className={`h-8 transition-opacity duration-300 ${
              expanded ? "opacity-100" : "opacity-0 w-0"
            }`}
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            <Menu />
          </button>
        </div>
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-2">{children}</ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}

export function SidebarItem({
  icon,
  text,
  active,
  alert,
  children,
  onClick,
  to = "#",
}) {
  const { expanded } = useContext(SidebarContext);
  const [open, setOpen] = useState(false);
  const hasChildren = Array.isArray(children);

  return (
    <>
      <li
        className={`relative flex items-center justify-between px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group 
          ${
            active
              ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
              : "hover:bg-indigo-50 text-gray-600"
          }`}
        onClick={() => {
          if (hasChildren) setOpen(!open);
        }}
      >
        <div className="flex items-center w-full">
          {icon}
          <span
            className={`flex items-center justify-between overflow-hidden transition-all ${
              expanded ? "w-full ml-3" : "w-0"
            }`}
          >
            {hasChildren ? (
              <span className="flex-1 py-3">{text}</span>
            ) : text === "Logout" ? (
              <span className="flex-1 py-3 cursor-pointer" onClick={onClick}>
                {text}
              </span>
            ) : (
              <Link to={to} className="flex-1 py-3">
                {text}
              </Link>
            )}

            {hasChildren && expanded && (
              <ChevronDown
                strokeWidth={2.5}
                className={`ml-auto transform transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
                size={16}
              />
            )}
          </span>
        </div>
      </li>
      <AnimatePresence initial={false}>
        {hasChildren && open && expanded && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="ml-8 mt-1 overflow-hidden space-y-1 font-medium"
          >
            {children.map((child, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="py-1 px-3 text-sm text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 rounded cursor-pointer"
              >
                <Link
                  to={`/admin/pengguna/${child.toLowerCase()}`}
                  className="block py-1 px-3 text-sm text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 rounded"
                >
                  {child}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );
}
