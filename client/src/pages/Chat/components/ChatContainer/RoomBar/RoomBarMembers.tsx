import { TRoomSearchUser } from "types/IRoom";
import { useGetAllUsersMutation } from "store/user/userApi";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { BiSolidUser } from "react-icons/bi";

interface props {
  userId: string | null;
}

const RoomBarMembers = ({ userId }: props) => {
  const [getUsers] = useGetAllUsersMutation();

  const [usersData, setUsersData] = useState<TRoomSearchUser[]>();

  const getAllUsers = async () => {
    try {
      const data = await getUsers().unwrap();

      setUsersData(data);
    } catch (error) {
      toast.error("there is no other users");
    }
  };

  useEffect(() => {
    getAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="mb-5 text-center">
        <div className="flex justify-center font-bold">
          <p className="font-Inter dark:text-white mb-1 text-lg">All Users</p>
          <span className="flex items-center justify-center w-6 h-6 ml-2 text-xs text-black bg-gray-200 rounded-full">
            {usersData?.length}
          </span>
        </div>
        <h5 className="dark:text-gray-400 font-light leading-tight">
          you can search them in Invite List, add them to your own room and
          start conservation.
        </h5>
      </div>

      {usersData?.map(
        ({ _id, username, email }) =>
          userId !== _id && (
            <div key={_id} className=" flex items-center px-4 py-3">
              <BiSolidUser className="bg-slate-400 rounded-xl w-12 h-12 p-2 text-white" />

              <div className="font-Inter ml-3 font-semibold">
                <h3 className="dark:text-white text-base">{username}</h3>
                <p className="text-main-light-purple text-sm">{email}</p>
              </div>
            </div>
          )
      )}
    </>
  );
};

export default RoomBarMembers;
