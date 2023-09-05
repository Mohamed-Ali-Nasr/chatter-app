import { Listbox, Transition } from "@headlessui/react";
import { HiOutlineChevronUpDown } from "react-icons/hi2";
import { AiOutlineCheck } from "react-icons/ai";
import { Fragment } from "react";
import { ITabs } from "types";

type Props = {
  tabs: ITabs[];
  selectedTab: ITabs;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelectedTab: (value: any) => void;
};

const ModeratorRoomBar = ({ tabs, selectedTab, setSelectedTab }: Props) => {
  return (
    <Listbox value={selectedTab.name} onChange={setSelectedTab}>
      <div className="relative w-full mt-1">
        <Listbox.Button className="focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default">
          <span className="block truncate">{selectedTab.name}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <HiOutlineChevronUpDown
              className="w-5 h-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg">
            {tabs.map((tab, tabIdx) => (
              <Listbox.Option
                key={tabIdx}
                className={() =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    tab.name === selectedTab.name
                      ? "bg-main-light-purple/[0.1] text-main-light-purple"
                      : "text-gray-900"
                  }`
                }
                value={tab}
              >
                <>
                  <span
                    className={`block truncate ${
                      tab.name === selectedTab.name
                        ? "font-medium"
                        : "font-normal"
                    }`}
                  >
                    {tab.name}
                  </span>
                  {tab.name === selectedTab.name ? (
                    <span className="text-main-light-purple absolute inset-y-0 left-0 flex items-center pl-3">
                      <AiOutlineCheck className="w-5 h-5" aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default ModeratorRoomBar;
