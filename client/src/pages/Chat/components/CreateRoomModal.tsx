import { FaXmark } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { userActions } from "store/user/userSlice";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import { fadeIn } from "utils/motion";
import { useCreateRoomMutation } from "store/room/roomApi";
import { useAppDispatch } from "hooks/redux-hooks";

const CreateRoomModal = () => {
  const dispatch = useAppDispatch();

  const [roomName, setRoomName] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);

  const [createRoom, { isLoading }] = useCreateRoomMutation();

  useEffect(() => {
    if (roomName === "") {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [roomName]);

  const handleCreateRoom = async () => {
    try {
      await createRoom(roomName);

      toast.success("Room created.");

      dispatch(userActions.toggleCreateRoomModal());
    } catch (error) {
      toast.error("try again later!.");
    }
  };

  return (
    <div
      className="absolute h-full w-full bg-gray-600/[0.8] z-20"
      onClick={() => dispatch(userActions.toggleCreateRoomModal())}
    >
      <motion.div
        className="container mx-auto"
        variants={fadeIn}
        initial="initial"
        animate="shown"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-[420px] max-w-full mx-auto mt-8">
          <div className="py-2 px-4 bg-white rounded-t-lg border-b border-gray-300 flex justify-between items-center dark:bg-[#171821] dark:text-white">
            <h5 className="font-DMSans">Create New Room</h5>
            <FaXmark
              className="text-my-light-purple cursor-pointer"
              width={22}
              onClick={() => dispatch(userActions.toggleCreateRoomModal())}
            />
          </div>

          <div className="flex flex-col py-2 px-4 bg-white rounded-b-lg dark:bg-[#171821] dark:text-white">
            <h5 className="font-Inter text-sm">room name</h5>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="border border-solid rounded border-gray-300 mt-2 px-2 dark:bg-[#585c7d] dark:text-white"
            />
            <button
              className="bg-main-light-purple font-Inter disabled:opacity-50 flex items-center justify-center w-full py-1 mt-2 font-light text-white rounded-lg cursor-pointer"
              disabled={canSubmit}
              onClick={handleCreateRoom}
            >
              {isLoading ? (
                <>
                  <Oval
                    height={20}
                    width={20}
                    color="#e1e1fc"
                    wrapperClass="mr-1"
                    secondaryColor="#8a8cf4"
                    strokeWidth={6}
                    strokeWidthSecondary={6}
                  />
                  Please Wait...
                </>
              ) : (
                "Create"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateRoomModal;
