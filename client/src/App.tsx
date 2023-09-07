import Account from "components/Account";
import CustomToastContainer from "components/CustomToastContainer";
import PersistLogin from "components/PersistLogin";
import Prefetch from "components/Prefetch";
import { AnimatePresence } from "framer-motion";
import Chat from "pages/Chat";
import Home from "pages/Home";
import SignIn from "pages/SignIn";
import SignUp from "pages/SignUp";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes>
          <Route element={<PersistLogin />}>
            <Route path="/" id="home" element={<Home />} />

            <Route
              path="sign-in"
              id="sign-in"
              element={
                <Account>
                  <SignIn />
                </Account>
              }
            />

            <Route
              path="sign-up"
              id="sign-up"
              element={
                <Account>
                  <SignUp />
                </Account>
              }
            />

            <Route element={<Prefetch />}>
              <Route id="chat" path="/chat" element={<Chat />} />
            </Route>
          </Route>
        </Routes>
      </AnimatePresence>

      <CustomToastContainer />
    </>
  );
};

export default App;
