import { Triangle } from "react-loader-spinner";

const ChatLoader = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-main-blue-gray">
      <Triangle
        height="100"
        width="100"
        color="#5bf7db"
        ariaLabel="triangle-loading"
        visible={true}
      />
    </div>
  );
};

export default ChatLoader;
