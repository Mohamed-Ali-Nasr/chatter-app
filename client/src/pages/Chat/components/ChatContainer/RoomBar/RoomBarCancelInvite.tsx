import { useAppDispatch } from "hooks/redux-hooks";
import { toast } from "react-toastify";
import { useCancelUserInviteMutation } from "store/room/roomApi";
import { userActions } from "store/user/userSlice";
import { IRoom } from "types/IRoom";
import { HiOutlineXCircle } from "react-icons/hi";
import { BiSolidUser } from "react-icons/bi";
import { socket } from "utils/socket";

type Props = {
  RoomId: string;
  Room: IRoom | undefined;
};

const RoomBarCancelInvite = ({ Room, RoomId }: Props) => {
  const dispatch = useAppDispatch();

  const [cancelInvite] = useCancelUserInviteMutation();

  const cancelInviteHandler = async (userId: string) => {
    try {
      await cancelInvite({ roomId: RoomId, canceledUserId: userId });

      dispatch(
        userActions.deleteUserFromInviteList({ roomId: RoomId, userId })
      );

      socket.emit("admin cancel invite", { roomId: RoomId, userId });
    } catch (error) {
      toast.error("Sorry! try again later.");
    }
  };

  return (
    <>
      {Room?.inviteList.length === 0 ? (
        <div className="font-Inter text-slate-400 flex items-center justify-center w-full h-full text-xl font-bold">
          Nope!
        </div>
      ) : (
        <div className="h-full overflow-auto">
          <div className="font-Inter dark:text-white flex items-center mb-2 text-sm font-bold">
            Invite List{" "}
            <span className="flex items-center justify-center w-6 h-6 ml-2 text-xs text-center text-black bg-gray-200 rounded-full">
              {Room?.inviteList.length}
            </span>
          </div>

          {Room?.inviteList.map(({ _id, name }) => (
            <div className="flex items-center px-2 py-3" key={_id}>
              <BiSolidUser className="bg-slate-400 rounded-xl w-12 h-12 p-2 text-white" />
              <h3 className="font-Inter dark:text-white ml-3 text-sm font-semibold">
                {name}
              </h3>
              <HiOutlineXCircle
                className="w-6 ml-auto text-white bg-red-500 rounded-full cursor-pointer"
                onClick={() => cancelInviteHandler(_id)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default RoomBarCancelInvite;
