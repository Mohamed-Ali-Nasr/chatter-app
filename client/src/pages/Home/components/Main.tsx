import GoalBanner from "components/GoalBanner";
import { goals } from "constants";
import { HiOutlineArrowRight } from "react-icons/hi";
import { Link } from "react-router-dom";

const Main = () => {
  return (
    <div className="container mx-auto">
      <div>
        <div className="mb-28">
          <h2 className="font-SFPro text-7xl font-bold text-center">
            OUR <span className="text-main-blue">GOAL</span>
          </h2>
        </div>
        <div className="lg:flex-row flex flex-col">
          {goals.map(({ title, blueTitle, desc }, index) => (
            <GoalBanner
              title={title}
              blueTitle={blueTitle}
              desc={desc}
              key={index}
            />
          ))}
        </div>
      </div>

      <div className="mt-14 mb-24 flex h-[567px] w-full flex-col items-center justify-evenly rounded-2xl bg-gradient-to-b from-[#605E65] to-[#292A33] text-center md:mt-56">
        <h2 className="font-SFPro text-7xl font-bold text-white">
          So, What do you waiting for?
        </h2>
        <p className="text-main-light-gray text-5xl font-normal leading-tight text-center">
          Let’s try Chatter and get the
          <br />
          benefit
        </p>
        <Link
          to={"/sign-in"}
          className="bg-main-blue font-DMSans flex items-center justify-center w-48 py-3 text-xl text-white rounded-lg"
        >
          Try it now
          <HiOutlineArrowRight className="w-7 ml-4" />
        </Link>
      </div>
    </div>
  );
};

export default Main;
