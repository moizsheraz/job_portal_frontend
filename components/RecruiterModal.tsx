"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

type RecruiterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
};

export const RecruiterModal = ({
  isOpen,
  onClose,
  isAuthenticated,
}: RecruiterModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-4 py-8 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-bold text-gray-900">
                  Login Required
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-gray-600">
                  You need to login to access this feature. Please login or create an account.
                </Dialog.Description>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 rounded-xl text-sm hover:bg-gray-300"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = "/login";
                    }}
                    className="px-4 py-2 bg-yellow-600 rounded-xl text-white text-sm hover:bg-[#001533]"
                  >
                    Login
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};