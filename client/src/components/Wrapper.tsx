import { motion } from "framer-motion";
import { fadeIn } from "utils/motion";

interface WrapperProps {
  children: React.ReactNode;
  className?: string;
}

const Wrapper = ({ children, className }: WrapperProps) => {
  return (
    <motion.div
      className={`${className} w-full`}
      variants={fadeIn}
      initial="initial"
      animate="shown"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

export default Wrapper;
