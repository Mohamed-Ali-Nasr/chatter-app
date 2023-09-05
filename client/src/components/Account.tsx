import { spacePercentage } from "constants";

const Account = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative z-20 flex h-screen w-full items-center justify-center bg-main-light-white">
      <div className="bg-clip-content absolute bottom-0 left-0 z-10 h-full w-full bg-white" />

      <div className="bg-clip-border absolute left-0 bottom-0 z-10 h-full w-full bg-main-turquoise" />

      <div className="bg-clip-padding absolute left-0 bottom-0 z-10 h-full w-full bg-white" />

      {spacePercentage.map((space, index) => (
        <div
          className={`${space} top-0 h-full w-2 border-r-2 border-dashed border-gray-500 opacity-[7%] absolute z-10`}
          key={index}
        ></div>
      ))}

      <div className="z-30 flex h-full w-full flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default Account;
