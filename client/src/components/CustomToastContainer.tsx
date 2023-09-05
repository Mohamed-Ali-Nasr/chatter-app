import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomToastContainer = () => {
  return (
    <div className="font-DMSans font-normal">
      <ToastContainer
        toastClassName="toast"
        position="top-right"
        closeButton={true}
        closeOnClick={false}
        limit={1}
        draggablePercent={60}
        autoClose={4000}
      />
    </div>
  );
};

export default CustomToastContainer;
