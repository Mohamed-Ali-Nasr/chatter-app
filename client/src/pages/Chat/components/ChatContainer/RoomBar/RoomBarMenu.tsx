import { BiSolidUser } from "react-icons/bi";
import { FaEllipsisV } from "react-icons/fa";
import { Fragment } from "react";
import { IRoom, TRoomUser } from "types/IRoom";
import { useBannedUserMutation, useKickUserMutation } from "store/room/roomApi";
import { Menu, Transition } from "@headlessui/react";
import { userActions } from "store/user/userSlice";
import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { toast } from "react-toastify";
import { selectUser } from "store/user/userSlice";
import { socket } from "utils/socket";

type Props = {
  roomUser: TRoomUser;
  isModerator: boolean;
  RoomId: string;
  Room: IRoom;
};

const RoomBarMenu = ({ roomUser, isModerator, RoomId, Room }: Props) => {
  const { userId } = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  const [bannedUser] = useBannedUserMutation();

  const [kickUser] = useKickUserMutation();

  const kickHandler = async (userId: string) => {
    try {
      await kickUser({ roomId: RoomId, kickedUserId: userId });

      socket.emit("user kick", { RoomId, userId });
    } catch (error) {
      toast.error("Sorry! try again later.");
    }
  };

  const banHandler = async ({
    userId,
    username,
    roomId,
  }: {
    userId: string;
    username: string;
    roomId: string;
  }) => {
    try {
      await bannedUser({ roomId, bannedUserId: userId });

      dispatch(userActions.addUserToBlackList({ userId, username, roomId }));

      socket.emit("ban user", {
        roomId: RoomId,
        userId,
        roomName: Room!.name,
      });
    } catch (error) {
      toast.error("Sorry! try again later.");
    }
  };

  return (
    <div className="flex items-center px-2 py-3">
      <BiSolidUser className="bg-slate-400 rounded-xl w-12 h-12 p-2 text-white" />
      <h3 className="font-Inter dark:text-white ml-3 text-sm font-semibold">
        {roomUser.username}
      </h3>

      {roomUser.role === "1769" && (
        <span className="dark:text-main-light-purple text-main-blue relative inline-block ml-auto text-left">
          Admin
        </span>
      )}

      {isModerator && roomUser.userId !== userId && (
        <Menu as="div" className="relative inline-block ml-auto text-left">
          <div>
            <Menu.Button className="hover:bg-gray-300 inline-flex justify-center w-full px-2 py-2 text-sm font-medium bg-gray-200 border border-gray-500 rounded-md shadow-sm">
              <FaEllipsisV className="w-5 h-5 text-black" />
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
            <Menu.Items className="ring-1 ring-black ring-opacity-5 focus:outline-none absolute right-0 z-10 w-auto mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <h5
                      className={`"block text-sm" cursor-pointer rounded-md px-4 py-2 font-Inter ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`}
                      onClick={() => kickHandler(roomUser.userId)}
                    >
                      Kick
                    </h5>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <h5
                      className={`"block text-sm" cursor-pointer rounded-md px-4 py-2 font-Inter ${
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      }`}
                      onClick={() =>
                        banHandler({
                          userId: roomUser.userId,
                          username: roomUser.username,
                          roomId: Room._id,
                        })
                      }
                    >
                      Ban
                    </h5>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      )}
    </div>
  );
};

export default RoomBarMenu;
