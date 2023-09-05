export type TGoal = {
  title: string;
  blueTitle: string;
  desc: React.ReactElement;
};

const GoalBanner = ({ title, blueTitle, desc }: TGoal) => {
  return (
    <div className="flex w-full font-SFPro lg:last:justify-end mb-6 lg:mb-0">
      <div className="mr-4 h-auto w-2 rounded-lg bg-main-blue lg:h-full" />

      <div className="flex flex-col justify-around">
        <h5 className="mb-2 text-[65px] font-bold leading-none text-main-blue">
          {blueTitle}
          <span className="text-[60px] font-medium text-black"> {title}</span>
        </h5>
        <p className="font-SFPro text-lg font-light leading-6 text-main-blue-gray">
          {desc}
        </p>
      </div>
    </div>
  );
};

export default GoalBanner;
