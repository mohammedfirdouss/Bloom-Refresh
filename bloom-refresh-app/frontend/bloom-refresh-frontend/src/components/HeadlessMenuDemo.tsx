"use client";

import { Menu } from "@headlessui/react";

export function HeadlessMenuDemo() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="px-4 py-2 bg-gray-200 rounded">Options</Menu.Button>
      <Menu.Items className="absolute mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded shadow-lg">
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? "bg-gray-100" : ""
              } w-full px-4 py-2 text-left`}
            >
              Account settings
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? "bg-gray-100" : ""
              } w-full px-4 py-2 text-left`}
            >
              Documentation
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
