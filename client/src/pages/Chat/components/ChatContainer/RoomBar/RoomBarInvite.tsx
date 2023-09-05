import { useState, useEffect } from "react";
import { MagnifyingGlass } from "react-loader-spinner";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useUserSearchMutation } from "store/user/userApi";
import { IRoom, TRoomSearchUser } from "types/IRoom";
import { BiSolidUser } from "react-icons/bi";
import { HiOutlineUserPlus } from "react-icons/hi2";
import { Oval } from "react-loader-spinner";
import { useInviteUserMutation } from "store/room/roomApi";
import { toast } from "react-toastify";
import { userActions } from "store/user/userSlice";
import { useAppDispatch } from "hooks/redux-hooks";
import { socket } from "utils/socket";

type Props = {
  Room: IRoom | undefined;
  userId: string | null;
};

const RoomBarInvite = ({ Room }: Props) => {
  const dispatch = useAppDispatch();

  const [searchInputValue, setSearchInputValue] = useState("");
  const [userSearchData, setUserSearchData] = useState<TRoomSearchUser[]>();

  const [
    userSearch,
    { data: searchData, isLoading, isError, error, isUninitialized },
  ] = useUserSearchMutation();

  const [inviteUser, { isLoading: inviteUserLoading, originalArgs }] =
    useInviteUserMutation();

  useEffect(() => {
    setUserSearchData(searchData);
  }, [searchData]);

  const handleSearch = async () => {
    if (searchInputValue.trim().length > 0) {
      try {
        await userSearch({
          query: searchInputValue,
          roomId: Room!._id,
        }).unwrap();

        // eslint-disable-next-line no-empty
      } catch (error) {}
    }
  };

  const handleInvite = async (userId: string, username: string) => {
    try {
      await inviteUser({ roomId: Room!._id, invitedUserId: userId }).unwrap();

      const inviteData = { id: userId, name: username, roomId: Room!._id };

      dispatch(userActions.addUserToInviteList(inviteData));

      socket.emit("send invite", {
        users: Room!.users,
        inviteData,
        roomName: Room!.name,
      });

      setUserSearchData((userSearch) => {
        return userSearch?.filter((user) => user._id !== userId);
      });

      toast.success("User invited successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.data.error);
    }
  };

  return (
    <div className="relative flex flex-col items-center mb-4">
      <input
        type="text"
        value={searchInputValue}
        onChange={(e) => setSearchInputValue(e.target.value)}
        onKeyUp={handleSearch}
        placeholder="search..."
        className="cursor-text w-full px-2 py-1 border border-gray-200 border-solid rounded"
      />
      <FaMagnifyingGlass
        onClick={handleSearch}
        className="w-5 h-5 absolute right-3 top-[7px] text-gray-400 cursor-pointer"
      />

      {!isUninitialized && (
        <div className="w-full rounded bg-my-light-purple/[0.5] mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <MagnifyingGlass height="80" width="80" color="#625BF7" />
            </div>
          ) : isError ? (
            <p className="font-Inter dark:text-white px-4 py-2 text-xl font-semibold text-center text-black">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(error as any).data.error}
            </p>
          ) : (
            userSearchData && (
              <>
                {userSearchData.map(({ _id, username }) => (
                  <div className="flex items-center px-2 py-3" key={_id}>
                    <BiSolidUser className="bg-slate-400 rounded-xl w-12 h-12 p-2 text-white" />
                    <h3 className="font-Inter dark:text-white ml-3 text-sm font-semibold">
                      {username}
                    </h3>

                    {inviteUserLoading &&
                    originalArgs?.invitedUserId === _id ? (
                      <Oval
                        width={24}
                        height={24}
                        strokeWidth={6}
                        strokeWidthSecondary={6}
                        color="#625BF7"
                        secondaryColor="#8ba3af"
                        wrapperClass="ml-auto mr-2"
                      />
                    ) : (
                      <HiOutlineUserPlus
                        className="dark:text-white w-6 ml-auto mr-2 font-bold text-gray-800 cursor-pointer"
                        onClick={() => handleInvite(_id, username)}
                      />
                    )}
                  </div>
                ))}
              </>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default RoomBarInvite;
