import { HiOutlineArrowRight } from "react-icons/hi";
import Apple from "assets/apple-icon.png";
import Android from "assets/android-icon.png";
import Windows from "assets/windows-icon.png";
import Chat from "assets/home-chat-application.jpg";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="container mx-auto">
      <div className="mt-32 text-center">
        <h2 className="mb-32 font-DMSans text-7xl font-bold text-main-gray">
          Connect With your mate easily
        </h2>
        <p className="text-center text-3xl font-normal text-white">
          Chatter is a communication application between friend, family and team
          at the same <br /> time wrapped in one use-friendly application
        </p>
      </div>

      <div className="mt-24 flex items-center justify-center space-x-14">
        <button className="border-2 border-solid border-slate-400 bg-transparent py-3 flex items-center justify-center rounded-lg text-white font-DMSans text-xl w-48">
          Learn more
        </button>
        <Link
          to={"/sign-in"}
          className="bg-main-blue py-3 flex items-center justify-center rounded-lg text-white font-DMSans text-xl w-48"
        >
          Try it now
          <HiOutlineArrowRight className="ml-4 w-7" />
        </Link>
      </div>

      <p className="mt-10 text-center font-DMSans text-2xl font-light text-my-gray">
        Compatible with all OS in the world
      </p>

      <div className="mt-12 flex items-center justify-center space-x-6 lg:mb-[90px]">
        <img src={Apple} alt="" />
        <img src={Android} alt="" />
        <img src={Windows} alt="" />
      </div>

      <div className="relative hidden lg:flex">
        <div className="absolute top-0 h-[800px] w-full rounded-xl bg-[url('/src/assets/home-chat-background.jpg')] bg-cover drop-shadow-2xl">
          <img
            className="mx-auto mt-[110px] h-[95%] w-[80%] rounded-xl drop-shadow-xl"
            src={Chat}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
