import { useEffect } from "react";
import Account from "components/Account";
import CustomToastContainer from "components/CustomToastContainer";
import Layout from "components/Layout";
import PersistLogin from "components/PersistLogin";
import Prefetch from "components/Prefetch";
import { AnimatePresence } from "framer-motion";
import Chat from "pages/Chat";
import Home from "pages/Home";
import SignIn from "pages/SignIn";
import SignUp from "pages/SignUp";
import { Route, Routes, useLocation } from "react-router-dom";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location]);

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Layout />}>
            <Route element={<PersistLogin />}>
              <Route path="/" element={<Home />} />

              <Route
                path="sign-in"
                element={
                  <Account>
                    <SignIn />
                  </Account>
                }
              />

              <Route
                path="sign-up"
                element={
                  <Account>
                    <SignUp />
                  </Account>
                }
              />

              <Route element={<Prefetch />}>
                <Route path="chat" element={<Chat />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AnimatePresence>

      <CustomToastContainer />
    </>
  );
};

export default App;
