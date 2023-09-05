import {
  HiPlusSm,
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
} from "react-icons/hi";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { selectUser } from "store/user/userSlice";
import {
  useUserAcceptInviteMutation,
  useUserIgnoreInviteMutation,
} from "store/user/userApi";
import { userActions } from "store/user/userSlice";
import { TUserInviteList } from "types/IUser";
import { IRoom } from "types/IRoom";
import { IReceivedData } from "types";
import { socket } from "utils/socket";

const RoomList = () => {
  const { userId, username, inviteList, rooms } = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  const [acceptRoomInvite] = useUserAcceptInviteMutation();
  const [ignoreRoomInvite] = useUserIgnoreInviteMutation();

  const roomHandler = (roomId: string) => {
    dispatch(userActions.selectRoom(roomId));
  };

  const acceptInvite = async (roomId: string) => {
    try {
      await acceptRoomInvite({ roomId, userId: userId! });

      socket.emit("remove from room invite list", {
        roomId,
        userId,
      });

      socket.emit("user accept invite", {
        roomId,
        userId,
        username,
      });
    } catch (error) {
      toast.error("cant accept the invite");
    }
  };

  const ignoreInvite = async (roomId: string) => {
    await ignoreRoomInvite(roomId);

    socket.emit("remove from room invite list", {
      roomId,
      userId,
    });
  };

  useEffect(() => {
    socket.on("get invite for user", ({ _id, name }: TUserInviteList) => {
      const inviteData = {
        _id,
        name,
      };
      dispatch(userActions.addToInviteList(inviteData));
    });

    socket.on("user joined room", (receiveData: IReceivedData) => {
      dispatch(
        userActions.userJoinedRoom({
          roomId: receiveData.roomId!,
          userId: receiveData.userId!,
          username: receiveData.username!,
        })
      );
    });

    socket.on("banned by admin", (receiveData: IReceivedData) => {
      dispatch(userActions.removeRoom(receiveData.roomId!));
      toast.info(`you are banned from ${receiveData.roomName}`);
    });

    socket.on("remove room", (receiveData: IReceivedData) => {
      console.log(receiveData);
      dispatch(userActions.removeRoom(receiveData.roomId!));
      toast.info(`you are banned from ${receiveData.roomName}`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full border-r flex flex-col dark:bg-[#1c1d26] w-full select-none">
      <div className="flex items-center justify-between p-5 border-b">
        <h5 className="font-Inter dark:text-white text-xl font-semibold">
          Message
        </h5>
        <HiPlusSm
          onClick={() => dispatch(userActions.toggleCreateRoomModal())}
          className="bg-main-light-purple box-content w-6 h-6 p-2 text-white rounded-full cursor-pointer"
        />
      </div>

      {inviteList.length !== 0 && (
        <div className="flex flex-col p-5">
          <div className="rounded-lg bg-main-light-purple/[0.5] p-5">
            <p className="font-Inter text-base font-bold text-white">
              You Are Invited To:
            </p>

            {inviteList.map((invitedRoom) => (
              <div
                className="flex items-center px-2 py-3"
                key={invitedRoom._id}
              >
                <div className="last:mb-0 flex w-full px-2 py-3 mb-10 bg-white rounded-lg cursor-default">
                  <HiOutlineUserGroup className="max-w-[32px] max-h-8 p-2 bg-slate-400 rounded-full mr-3 text-white box-content" />
                  <div className="flex items-center justify-between w-full">
                    <h4 className="font-Inter text-sm font-bold text-black">
                      {invitedRoom.name}
                    </h4>
                    <div className="flex">
                      <HiOutlineCheckCircle
                        width={24}
                        className="mr-1 text-white bg-green-600 rounded-full cursor-pointer"
                        onClick={() => acceptInvite(invitedRoom._id)}
                      />
                      <HiOutlineXCircle
                        width={24}
                        className="text-white bg-red-600 rounded-full cursor-pointer"
                        onClick={() => ignoreInvite(invitedRoom._id)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {rooms.length === 0 ? (
        <h5 className="font-SFPro text-slate-600 dark:text-slate-400 p-5 text-xl font-semibold">
          Join or create room!
        </h5>
      ) : (
        <div className="p-5 flex flex-col scrollbar-thumb-main-light-purple/[.40] scrollbar-track-transparent scrollbar-thin scrollbar-thumb-rounded-md">
          {rooms.map((room: IRoom) => (
            <div
              className="last:mb-0 flex mb-10 cursor-pointer"
              key={room._id}
              onClick={() => roomHandler(room._id)}
            >
              <HiOutlineUserGroup className="max-w-[32px] max-h-8 p-2 bg-slate-400 rounded-full mr-3 text-white box-content" />
              <div className="flex flex-col items-center justify-center">
                <h4 className="font-Inter dark:text-white text-sm font-bold">
                  {room.name}
                </h4>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomList;
