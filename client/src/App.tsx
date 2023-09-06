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
import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location]);

  useEffect(() => {
    if (location.pathname.startsWith("/chat"))
      window.addEventListener("load", () => {
        navigate("/");
        window.location.reload();
      });

    return () => {
      window.removeEventListener("load", () => {
        navigate("/");
        window.location.reload();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Layout />}>
            <Route element={<PersistLogin />}>
              <Route index element={<Home />} />

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
                <Route path="/chat" element={<Chat />} />
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
