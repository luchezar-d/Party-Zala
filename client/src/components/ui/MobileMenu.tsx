import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Menu as MenuIcon, X, LogOut, Calendar, List } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface MobileMenuProps {
  userName?: string; // Optional since we don't display it
  onLogout: () => void;
}

export default function MobileMenu({ onLogout }: MobileMenuProps) {
  const location = useLocation();
  
  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 shadow-md flex items-center justify-center active:scale-95 transition-all focus-ring">
            {open ? (
              <X className="h-5 w-5 text-white" />
            ) : (
              <MenuIcon className="h-5 w-5 text-white" />
            )}
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none overflow-hidden">
              {/* Menu Items */}
              <div className="py-2">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/calendar"
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors ${
                        location.pathname === '/calendar'
                          ? 'bg-sky-50 text-sky-700'
                          : active
                          ? 'bg-gray-50 text-gray-900'
                          : 'text-gray-700'
                      }`}
                    >
                      <Calendar className="h-5 w-5" />
                      Календар
                    </Link>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/all-parties"
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors ${
                        location.pathname === '/all-parties'
                          ? 'bg-sky-50 text-sky-700'
                          : active
                          ? 'bg-gray-50 text-gray-900'
                          : 'text-gray-700'
                      }`}
                    >
                      <List className="h-5 w-5" />
                      Всички партита
                    </Link>
                  )}
                </Menu.Item>
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={onLogout}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors ${
                        active ? 'bg-red-50 text-red-700' : 'text-red-600'
                      }`}
                    >
                      <LogOut className="h-5 w-5" />
                      Изход
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
}
