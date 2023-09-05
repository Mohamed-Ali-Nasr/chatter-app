import { useAppDispatch } from "hooks/redux-hooks";
import { useUnBannedUserMutation } from "store/room/roomApi";
import { HiOutlineXCircle } from "react-icons/hi";
import { BiSolidUser } from "react-icons/bi";
import { toast } from "react-toastify";
import { userActions } from "store/user/userSlice";
import { IRoom } from "types/IRoom";

type Props = {
  RoomId: string;
  Room: IRoom | undefined;
};

const RoomBarBlackList = ({ Room, RoomId }: Props) => {
  const dispatch = useAppDispatch();

  const [unBannedRoomUser] = useUnBannedUserMutation();

  const unbanHandler = async (userId: string) => {
    try {
      await unBannedRoomUser({ roomId: RoomId, bannedUserId: userId });

      dispatch(userActions.removeUserFromBlacklist({ roomId: RoomId, userId }));
    } catch (error) {
      toast.error("Sorry! try again later.");
    }
  };

  return (
    <>
      {Room?.blackList.length === 0 ? (
        <div className="font-Inter text-slate-400 flex items-center justify-center w-full h-full text-xl font-bold">
          Nope!
        </div>
      ) : (
        <div className="h-full overflow-auto">
          <div className="font-Inter dark:text-white flex items-center mb-2 text-sm font-bold">
            Black List{" "}
            <span className="flex items-center justify-center w-6 h-6 ml-2 text-xs text-center text-black bg-gray-200 rounded-full">
              {Room?.blackList.length}
            </span>
          </div>

          {Room?.blackList.map(({ _id, name }) => (
            <div className="flex items-center px-2 py-3" key={_id}>
              <BiSolidUser className="bg-slate-400 rounded-xl w-12 h-12 p-2 text-white" />
              <h3 className="font-Inter dark:text-white ml-3 text-sm font-semibold">
                {name}
              </h3>
              <HiOutlineXCircle
                className="w-6 ml-auto text-white bg-red-500 rounded-full cursor-pointer"
                onClick={() => unbanHandler(_id)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default RoomBarBlackList;
