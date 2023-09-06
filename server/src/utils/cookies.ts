export const createTokenOptions = () => {
  if (process.env.NODE_ENV === "development") {
    return { httpOnly: false, secure: false, sameSite: true };
  } else if (process.env.NODE_ENV === "production") {
    return { httpOnly: true, secure: true, sameSite: true };
  }
};
