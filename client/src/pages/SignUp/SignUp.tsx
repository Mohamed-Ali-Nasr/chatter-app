import Wrapper from "components/Wrapper";
import { useFormik } from "formik";
import { Oval } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRegisterMutation } from "store/auth/authApi";
import { SignUpSchema } from "utils/validation";

type FormValues = {
  email: string;
  username: string;
  password: string;
  repeatPassword: string;
};

const SignUp = () => {
  document.title = "Sign up";

  const navigate = useNavigate();

  const initialValues: FormValues = {
    email: "",
    username: "",
    password: "",
    repeatPassword: "",
  };

  const [signUp, { isLoading }] = useRegisterMutation();

  const submitForm = async (values: FormValues) => {
    try {
      await signUp({
        email: values.email,
        username: values.username,
        password: values.password,
      }).unwrap();

      toast.success("Thanks for create account, please login to your account.");

      navigate("/sign-in");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.data?.data?.username) {
        errors.username = error?.data?.data?.username;
      }
      if (error?.data?.data?.email) {
        errors.email = error?.data?.data?.email;
      }
      if (error?.data?.data?.password) {
        errors.password = error?.data?.data?.password;
      }
    }
  };

  const {
    values,
    errors,
    touched,
    isValid,
    dirty,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: SignUpSchema,
    onSubmit: submitForm,
  });

  return (
    <Wrapper className="overflow-hidden">
      <div className="container mx-auto overflow-hidden">
        <div className="mx-auto w-full bg-white px-8 py-12 font-Mulish drop-shadow-md sm:w-[454px]">
          <p className="text-main-dark-gray text-sm font-light">Hi! 👋</p>
          <h5 className="mb-7 text-2xl font-bold">Create your account</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex justify-between mb-3">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <p className="text-red-600">{errors.email || touched.email}</p>
              </div>
              <input
                type="text"
                id="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="h-[45px] w-full rounded-lg border border-solid border-main-gray px-4"
              />
            </div>

            <div className="mb-7">
              <div className="flex justify-between mb-3">
                <label className="text-sm font-medium" htmlFor="username">
                  Username
                </label>
                <p className="text-red-600">
                  {errors.username || touched.username}
                </p>
              </div>
              <input
                type="text"
                id="username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                className="h-[45px] w-full rounded-lg border border-solid border-main-gray px-4"
              />
            </div>

            <div className="mb-7">
              <div className="flex justify-between mb-3">
                <label className="text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <p className="text-red-600">
                  {errors.password || touched.password}
                </p>
              </div>
              <input
                type="password"
                id="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className="h-[45px] w-full rounded-lg border border-solid border-main-gray px-4"
              />
            </div>

            <div className="mb-7">
              <div className="flex justify-between mb-3">
                <label className="text-sm font-medium" htmlFor="repeatPassword">
                  Repeat password
                </label>
                <p className="text-red-600">
                  {errors.repeatPassword || touched.repeatPassword}
                </p>
              </div>
              <input
                type="password"
                id="repeatPassword"
                value={values.repeatPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className="h-[45px] w-full rounded-lg border border-solid border-main-gray px-4"
              />
            </div>

            <button
              disabled={!(dirty && isValid) || isLoading}
              className={`${
                !isValid || isLoading ? "opacity-60" : ""
              } h-[45px] bg-gradient-to-b from-[#625BF7] to-[#463EEA] w-full font-extrabold text-base text-white rounded-md flex justify-center items-center`}
              type="submit"
            >
              {isLoading ? (
                <Oval width="30px" height="30px" color="#fff" />
              ) : (
                "CONTINUE"
              )}
            </button>
          </form>
        </div>

        <p className="font-Mulish mt-12 text-xs font-light text-center">
          You have an account?{" "}
          <Link to="/sign-in" className="text-my-light-purple text-xs">
            Sign in
          </Link>
        </p>
      </div>
    </Wrapper>
  );
};

export default SignUp;
