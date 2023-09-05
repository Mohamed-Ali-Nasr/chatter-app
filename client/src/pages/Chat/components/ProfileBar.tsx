import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "hooks/redux-hooks";
import { selectUser } from "store/user/userSlice";
import { useLogoutMutation } from "store/auth/authApi";
import { toast } from "react-toastify";
import { authActions } from "store/auth/authSlice";
import DarkModeButton from "components/DarkModeButton";

const ProfileBar = () => {
  const { username } = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  const [logout] = useLogoutMutation();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout("");

      dispatch(authActions.logOut({ token: null, authStatus: false }));

      toast.success("logged out successfully");

      navigate("/", { replace: true });
    } catch (error) {
      toast.error("Sorry! try again later.");
    }
  };

  return (
    <div className="w-20 h-full shadow-to-r dark:bg-[#171821]">
      <div className="flex flex-col justify-between h-full p-3">
        <div className="flex justify-center">
          <div className="bg-main-light-purple w-[56px] h-[56px] capitalize rounded-2xl text-center items-center leading-[56px] text-white font-bold font-SFPro text-xl">
            {username![0]}
          </div>
        </div>

        <div className="flex flex-col">
          <DarkModeButton />

          <HiOutlineArrowRightOnRectangle
            className="dark:text-white w-8 h-8 mx-auto cursor-pointer"
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileBar;
