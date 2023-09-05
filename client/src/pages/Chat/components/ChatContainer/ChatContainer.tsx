import { HiPaperAirplane } from "react-icons/hi";
import { useState, useEffect, useRef } from "react";
import { userActions } from "store/user/userSlice";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { selectUser } from "store/user/userSlice";
import {
  useGetRoomMessagesMutation,
  useSendMessageMutation,
  useUploadMessageImgMutation,
} from "store/message/messageApi";
import ChatLoader from "components/ChatLoader";
import RoomBar from "./RoomBar";
import { IMessage } from "types/IMessage";
import ChatMenu from "./ChatMenu";
import { socket } from "utils/socket";
import Moment from "react-moment";
import { Skin } from "@emoji-mart/data";
import { BsEmojiSmile, BsImage } from "react-icons/bs";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { AiOutlineCloseCircle } from "react-icons/ai";

const ChatContainer = () => {
  const { selectedRoomId, userId, rooms } = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  const Room = rooms.find((room) => room._id === selectedRoomId);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [image, setImage] = useState<File | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_messages, setMessages] = useState<IMessage[] | undefined>(
    Room?.messages
  );

  const chatScroll = useRef<HTMLDivElement | null>(null);

  const [getRoomMessage, { isLoading, isSuccess }] =
    useGetRoomMessagesMutation();

  const [sendMessage] = useSendMessageMutation();

  const [uploadMessageImg] = useUploadMessageImgMutation();

  const getMessages = async () => {
    try {
      const data = await getRoomMessage(selectedRoomId!).unwrap();

      dispatch(
        userActions.setRoomMessages({ roomId: Room!._id, messages: data })
      );
    } catch (error) {
      toast.error("refresh the page!");
    }
  };

  useEffect(() => {
    document.title = `Chatter - ${Room?.name}`;

    getMessages();

    socket.emit("join chat", selectedRoomId);

    return () => {
      setMessages([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoomId]);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        chatScroll.current!.scrollTop = chatScroll.current!.scrollHeight;
      }, 200);
    }
  }, [Room?.messages, isSuccess]);

  const enterPressed = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      submit();
    }
  };

  const addEmoji = (e: Skin) => {
    const sym: string[] = e.unified.split("-");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const codesArray: any[] = [];

    sym.forEach((el) => codesArray.push("0x" + el));

    const emoji = String.fromCodePoint(...codesArray);

    setInputValue(inputValue + emoji);
  };

  const submit = async () => {
    if (inputValue.trim().length > 0 || image) {
      try {
        const formData = new FormData();
        let filename = null;

        if (image) {
          formData.append("image", image);
          const res = await uploadMessageImg(formData).unwrap();
          filename = res.filename;
        }

        const response = await sendMessage({
          message: inputValue,
          img: filename!,
          roomId: selectedRoomId!,
        }).unwrap();

        dispatch(
          userActions.addRoomMessage({
            roomId: Room!._id,
            messageData: response,
          })
        );

        socket.emit("new message", {
          users: Room?.users,
          messageData: response,
        });

        setInputValue("");
        setShowEmojis(false);
        setImage(null);
      } catch (error) {
        toast.error("You Must Type Your Message");
      }
    }
  };

  useEffect(() => {
    document.addEventListener("click", () => setShowEmojis(false));

    return () => {
      document.removeEventListener("click", () => setShowEmojis(false));
    };
  });

  return (
    <>
      {Room && isLoading && <ChatLoader />}

      {Room && isSuccess && (
        <>
          <div className="w-full h-full min-w-0">
            <div className="flex flex-col h-full">
              <ChatMenu
                Room={Room}
                selectedRoomId={selectedRoomId}
                userId={userId}
                setIsMenuOpen={setIsMenuOpen}
              />

              <div className="flex flex-col h-full">
                <div
                  className="h-full flex flex-col scrollbar-thumb-main-light-purple/[.40] scrollbar-track-transparent scrollbar-thin flex-[1_1_0] px-6 pb-0 pt-3 overflow-y-scroll"
                  ref={chatScroll}
                >
                  {Room.messages &&
                    Room.messages.map(
                      ({
                        _id,
                        message,
                        senderId,
                        senderName,
                        createdAt,
                        img,
                      }) =>
                        senderId === userId ? (
                          <div
                            className="py-3 px-5 text-white bg-main-light-purple text-sm self-end rounded-2xl mb-4 last:mb-0 break-words max-w-[75%]"
                            key={_id}
                          >
                            {img && (
                              <div className="p-3 w-48 h-48 mx-auto">
                                <img
                                  src={`${
                                    import.meta.env.VITE_BASE_URL
                                  }/images/${img}`}
                                  className="rounded-lg transition-all duration-[250ms] w-full h-full object-cover hover:scale-[1.1]"
                                />
                              </div>
                            )}

                            <p className="font-Inter">{message}</p>

                            <span className="hover:underline text-[0.65rem] italic text-gray-300">
                              <Moment fromNow>{createdAt}</Moment>
                            </span>
                          </div>
                        ) : (
                          <div
                            className="py-3 px-5 text-black bg-gray-300 rounded-2xl self-start mb-4 last:mb-0 break-words max-w-[75%]"
                            key={_id}
                          >
                            <h5 className="text-main-light-purple mb-3 text-sm font-extrabold underline">
                              {senderName}
                            </h5>
                            {img && (
                              <div className="p-3 w-48 h-48 mx-auto">
                                <img
                                  src={`${
                                    import.meta.env.VITE_BASE_URL
                                  }/images/${img}`}
                                  className="rounded-lg transition-all duration-[250ms] w-full h-full object-cover hover:scale-[1.1]"
                                />
                              </div>
                            )}
                            <p className="font-Inter leading-3 font-semibold">
                              {message}
                            </p>
                            <span className="hover:underline text-[0.65rem] italic text-main-blue">
                              <Moment fromNow>{createdAt}</Moment>
                            </span>
                          </div>
                        )
                    )}
                </div>
              </div>

              <div className="relative w-full px-6 py-4 select-none">
                <input
                  placeholder="Type a message"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={enterPressed}
                  className="rounded-xl pr-14 font-Inter cursor-text w-full h-12 px-5 text-sm border-2 border-gray-200 border-solid"
                />

                <div>
                  <label htmlFor="image">
                    {!image && (
                      <BsImage className="absolute right-32 sm:right-[150px] top-1/2 -translate-y-1/2 w-6 h-6 text-main-light-purple cursor-pointer" />
                    )}
                  </label>
                  <input
                    type="file"
                    id="image"
                    onChange={(e) => setImage(e.target.files![0])}
                    style={{ display: "none" }}
                    multiple={false}
                    accept=".jpeg,.jpg,.png,.gif"
                  />

                  {image && (
                    <p className="absolute right-32 sm:right-36 top-[30px] flex text-black font-semibold text-sm">
                      {image.name}
                      <AiOutlineCloseCircle
                        onClick={() => {
                          setInputValue("");
                          setImage(null);
                        }}
                        className="cursor-pointer text-[16px]"
                      />
                    </p>
                  )}
                </div>

                <HiPaperAirplane
                  onClick={submit}
                  className="absolute right-[2.6rem] top-1/2 -translate-y-1/2 w-6 h-6 text-main-light-purple -rotate-45 cursor-pointer"
                />

                <div onClick={(e) => e.stopPropagation()}>
                  <div
                    className=" sm:right-24 right-20 top-[26px] hover:bg-opacity-10 absolute sm:w-6 sm:h-6 ml-2 transition ease-out rounded-full cursor-pointer"
                    onClick={() => setShowEmojis((prevState) => !prevState)}
                  >
                    <BsEmojiSmile className="text-main-light-purple text-3xl" />
                  </div>
                  {showEmojis && (
                    <div className="absolute bottom-[100%] sm:right-2">
                      <Picker
                        data={data}
                        onEmojiSelect={addEmoji}
                        theme="dark"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <RoomBar
            RoomId={Room._id}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        </>
      )}
    </>
  );
};

export default ChatContainer;
