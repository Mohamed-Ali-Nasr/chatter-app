import { Fragment, useState, useEffect } from "react";
import {
  useDeleteRoomMutation,
  useEditRoomNameMutation,
  useUserLeaveRoomMutation,
} from "store/room/roomApi";
import { userActions } from "store/user/userSlice";
import { Menu, Transition } from "@headlessui/react";
import { FaEllipsisV } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { HiOutlineXMark } from "react-icons/hi2";
import { IRoom } from "types/IRoom";
import { toast } from "react-toastify";
import { useAppDispatch } from "hooks/redux-hooks";
import { socket } from "utils/socket";

type Props = {
  Room: IRoom;
  selectedRoomId: string | null;
  userId: string | null;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatMenu = ({ Room, selectedRoomId, userId, setIsMenuOpen }: Props) => {
  const dispatch = useAppDispatch();

  const [isModerator, setIsModerator] = useState(false);

  const [deleteRoom] = useDeleteRoomMutation();

  const [editRoomName] = useEditRoomNameMutation();

  const [userLeaveRoom] = useUserLeaveRoomMutation();

  useEffect(() => {
    const userRole = Room?.users.find((roomUser) => roomUser.userId === userId);

    if (userRole?.role !== "7610") {
      setIsModerator(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteRoomHandler = async () => {
    try {
      await deleteRoom(selectedRoomId!);

      socket.emit("delete room", {
        roomUsers: Room?.users,
        myId: userId,
        roomId: Room?._id,
        roomName: Room?.name,
      });
    } catch (error) {
      toast.error("try again later!.");
    }
  };

  const changeRoomNameHandler = async () => {
    try {
      const newName = prompt("enter new room name");

      if (newName && newName !== "") {
        await editRoomName({ roomId: selectedRoomId!, newRoomName: newName });
        dispatch(
          userActions.changeRoomName({
            roomId: selectedRoomId!,
            newRoomName: newName,
          })
        );

        socket.emit("change room name", {
          roomId: selectedRoomId,
          newRoomName: newName,
          roomUsers: Room?.users,
          myId: userId,
        });
      }
    } catch (error) {
      toast.error("try again later!.");
    }
  };

  const leaveRoomHandler = async () => {
    if (window.confirm("you sure you want leave the room?")) {
      try {
        await userLeaveRoom({ roomId: selectedRoomId!, userId: userId! });

        dispatch(userActions.removeRoom(selectedRoomId!));
        socket.emit("user leave the room", {
          roomId: selectedRoomId!,
          userId: userId!,
          roomUsers: Room?.users,
        });
      } catch (error) {
        toast.error("try again later!.");
      }
    }
  };

  return (
    <div className="flex border-b min-h-[80px] px-4 items-center">
      <HiOutlineXMark
        className="dark:text-white md:hidden mr-3 text-black cursor-pointer"
        width={24}
        onClick={() => dispatch(userActions.selectRoom(null))}
      />

      <HiUserGroup
        onClick={() => setIsMenuOpen(true)}
        className="bg-slate-400 w-10 h-10 p-2 mr-3 text-white rounded-full cursor-pointer"
      />
      <h3 className="font-Inter dark:text-white text-xl font-bold select-none">
        {Room.name}
      </h3>
      <Menu as="div" className="relative inline-block ml-auto text-left">
        <div>
          <Menu.Button className="inline-flex justify-center w-full text-sm font-medium rounded-md">
            <FaEllipsisV width={32} className="dark:text-white text-black" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="ring-1 ring-black ring-opacity-5 focus:outline-none absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg">
            <div className="px-1 py-1">
              {isModerator ? (
                <>
                  <Menu.Item>
                    {({ active }) => (
                      <h5
                        className={`block text-sm rounded-md px-4 py-2 font-Inter cursor-pointer ${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        }`}
                        onClick={() => changeRoomNameHandler()}
                      >
                        rename room
                      </h5>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <h5
                        className={`block text-sm rounded-md px-4 py-2 font-Inter cursor-pointer ${
                          active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                        }`}
                        onClick={deleteRoomHandler}
                      >
                        delete room
                      </h5>
                    )}
                  </Menu.Item>
                </>
              ) : (
                <Menu.Item>
                  {({ active }) => (
                    <h5
                      className={`block text-sm rounded-md px-4 py-2 font-Inter cursor-pointer ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`}
                      onClick={leaveRoomHandler}
                    >
                      leave room
                    </h5>
                  )}
                </Menu.Item>
              )}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default ChatMenu;
