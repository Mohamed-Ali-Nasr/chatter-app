export const fadeIn = {
  initial: {
    opacity: 0,
    y: 50,
  },
  shown: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      type: "anticipate",
    },
  },
  exit: {
    y: -50,
    opacity: 0,
  },
};
