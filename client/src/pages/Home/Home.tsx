import Wrapper from "components/Wrapper";
import Header from "./components/Header";
import Main from "./components/Main";
import Navbar from "./components/Navbar";

const Home = () => {
  return (
    <Wrapper>
      <div className="bg-header h-full bg-cover bg-no-repeat lg:pb-[400px] lg:mb-[580px] lg:bg-[0_-300px] pb-4 mb-4">
        <Navbar />
        <Header />
      </div>
      <Main />
    </Wrapper>
  );
};

export default Home;
