import { useState, useEffect, useRef } from "react";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { tabs } from "constants";
import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { selectUser, userActions } from "store/user/userSlice";
import ModeratorRoomBar from "components/ModeratorRoomBar";
import { ITabs } from "types";
import useMediaQuery from "hooks/useMediaQuery";
import RoomBarMenu from "./RoomBarMenu";
import RoomBarInvite from "./RoomBarInvite";
import RoomBarCancelInvite from "./RoomBarCancelInvite";
import RoomBarBlackList from "./RoomBarBlackList";
import { socket } from "utils/socket";
import RoomBarMembers from "./RoomBarMembers";

type Props = {
  RoomId: string;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const RoomBar = ({ RoomId, isMenuOpen, setIsMenuOpen }: Props) => {
  const { userId, rooms } = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  const Room = rooms.find((room) => room._id === RoomId);

  const mediaQueryDesktop = useMediaQuery("(max-width:1024px)");

  const [isModerator, setIsModerator] = useState(false);

  const [selectedTab, setSelectedTab] = useState<ITabs>(tabs[1]);

  const listsOverflow = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const userRole = Room?.users.find((roomUser) => roomUser.userId === userId);

    if (userRole?.role !== "7610") {
      setIsModerator(true);
    }

    socket.on("invite canceled by admin", (roomId: string) => {
      dispatch(userActions.ignoreInvite(roomId));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    listsOverflow.current!.scrollLeft =
      listsOverflow.current!.clientWidth * selectedTab.tabNumber;
  }, [selectedTab]);

  return (
    <div
      className={`border-l flex flex-col h-full bg-white dark:bg-[#171821] ${
        isMenuOpen
          ? mediaQueryDesktop && "min-w-full md:min-w-[50%]"
          : mediaQueryDesktop && "max-w-0 hidden"
      } ${mediaQueryDesktop ? "absolute right-0" : "min-w-[20%]"}`}
    >
      <div className="flex items-center justify-between w-full min-h-[80px] border-b px-4">
        {mediaQueryDesktop && (
          <HiOutlineChevronLeft
            width={32}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="mr-3 dark:text-white cursor-pointer"
          />
        )}

        <ModeratorRoomBar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          tabs={tabs}
        />
      </div>

      <div
        className="scroll-smooth relative flex w-full h-full overflow-hidden scrollbar-thumb-main-light-purple/[.40] scrollbar-track-transparent scrollbar-thin overflow-y-scroll"
        ref={listsOverflow}
      >
        <div className="left-full absolute w-full h-full px-3 py-4">
          <div className="h-full">
            <h5 className="font-Inter dark:text-white flex items-center mb-2 text-sm font-bold">
              Room Member
              <span className="flex items-center justify-center w-6 h-6 ml-2 text-xs text-center text-black bg-gray-200 rounded-full">
                {Room?.users.length}
              </span>
            </h5>

            {Room?.users.map((roomUser) => (
              <RoomBarMenu
                key={roomUser.userId}
                Room={Room}
                roomUser={roomUser}
                isModerator={isModerator}
                RoomId={RoomId}
              />
            ))}
          </div>
        </div>

        {isModerator && (
          <>
            <div className="-order-1 absolute left-0 flex flex-col w-full h-full px-3 py-4">
              <RoomBarInvite Room={Room} userId={userId} />

              <RoomBarCancelInvite Room={Room} RoomId={RoomId} />
            </div>

            <div className="absolute h-full w-full left-[200%] px-3 py-4">
              <RoomBarBlackList Room={Room} RoomId={RoomId} />
            </div>
          </>
        )}
        <div className="absolute h-full w-full left-[300%] px-3 py-4">
          <RoomBarMembers userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default RoomBar;
