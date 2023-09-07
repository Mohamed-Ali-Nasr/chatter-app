import Account from "components/Account";
import CustomToastContainer from "components/CustomToastContainer";
import Layout from "components/Layout";
import PersistLogin from "components/PersistLogin";
import Prefetch from "components/Prefetch";
import Chat from "pages/Chat";
import Home from "pages/Home";
import SignIn from "pages/SignIn";
import SignUp from "pages/SignUp";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<PersistLogin />}>
            <Route path="/" id="home" index element={<Home />} />

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
        </Route>
      </Routes>

      <CustomToastContainer />
    </>
  );
};

export default App;
