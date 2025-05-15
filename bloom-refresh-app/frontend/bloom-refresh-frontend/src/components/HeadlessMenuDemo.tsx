"use client";

import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

export function HeadlessMenuDemo() {
  return (
    <Menu>
      <MenuButton className="px-4 py-2 bg-gray-200 rounded data-[open]:bg-gray-300">
        Options
      </MenuButton>
      <MenuItems
        anchor="bottom end"
        className="absolute mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded shadow-lg z-10"
      >
        <MenuItem>
          {({ active }) => (
            <button
              className={`w-full px-4 py-2 text-left ${active ? "bg-gray-100" : ""}`}
            >
              Account settings
            </button>
          )}
        </MenuItem>
        <MenuItem>
          {({ active }) => (
            <button
              className={`w-full px-4 py-2 text-left ${active ? "bg-gray-100" : ""}`}
            >
              Documentation
            </button>
          )}
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
