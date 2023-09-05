import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Wrapper from "components/Wrapper";
import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { selectUser, userActions } from "store/user/userSlice";
import ProfileBar from "./components/ProfileBar";
import RoomList from "./components/RoomList";
import ChatContainer from "./components/ChatContainer";
import CreateRoomModal from "./components/CreateRoomModal";
import { IMessage } from "types/IMessage";
import { socket } from "utils/socket";

const Chat = () => {
  const {
    selectedRoomId,
    userId: currentUserId,
    isCreateRoomModalShow: isCreateRoomModalOpen,
  } = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = "Chatter";

    socket.onAny((eventName, ...args) => {
      console.log(eventName, args);
    });

    socket.emit("setup", currentUserId);

    socket.on("user kicked", (receiveData: { roomId: string }) => {
      dispatch(userActions.selectRoom(null));
      dispatch(userActions.removeRoom(receiveData.roomId));
      toast.info("you are kicked from a room");
    });

    socket.on(
      "user removed from room invite list",
      (receiveData: { roomId: string; userId: string }) => {
        dispatch(
          userActions.deleteUserFromInviteList({
            roomId: receiveData.roomId,
            userId: receiveData.userId,
          })
        );
      }
    );

    socket.on(
      "room name changed",
      (receiveData: { roomId: string; newRoomName: string }) => {
        dispatch(
          userActions.changeRoomName({
            roomId: receiveData.roomId,
            newRoomName: receiveData.newRoomName,
          })
        );
      }
    );

    socket.on(
      "user leave the room",
      (receiveData: { roomId: string; userId: string }) => {
        dispatch(
          userActions.removeUserFromRoom({
            roomId: receiveData.roomId,
            userId: receiveData.userId,
          })
        );
      }
    );

    socket.on("new message", ({ messageData }: { messageData: IMessage }) => {
      dispatch(
        userActions.addRoomMessage({
          roomId: messageData.roomId,
          messageData,
        })
      );
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <div className="flex h-screen dark:bg-[#171821] relative z-10">
        <div
          className={`absolute left-0 z-20 flex h-full w-full md:relative md:w-[50%] lg:w-[40%] xl:w-[40%] ${
            selectedRoomId ? "hidden md:flex" : ""
          }`}
        >
          <ProfileBar />

          <RoomList />
        </div>

        {selectedRoomId && <ChatContainer />}

        <AnimatePresence>
          {isCreateRoomModalOpen && <CreateRoomModal />}
        </AnimatePresence>
      </div>
    </Wrapper>
  );
};

export default Chat;
