import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import { authActions } from "store/auth/authSlice";
import Wrapper from "components/Wrapper";
import { useAppDispatch } from "hooks/redux-hooks";
import { useLoginMutation } from "store/auth/authApi";
import { SignInSchema } from "utils/validation";

const SignIn = () => {
  document.title = "Sign-in";

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const initialValues: Record<string, string> = {
    email: "",
    password: "",
  };

  const [signIn, { isLoading }] = useLoginMutation();

  const submitForm = async () => {
    try {
      const result = await signIn({
        email: values.email,
        password: values.password,
      }).unwrap();

      toast.success("Welcome");

      dispatch(authActions.setToken(result.accessToken));

      navigate("/chat");
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
      if (error?.status === "FETCH_ERROR") {
        toast.error("Try again later!");
      }
      if (error.status === 400) {
        toast.error(error.data.error);
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
    validationSchema: SignInSchema,
    onSubmit: submitForm,
  });

  return (
    <Wrapper className="overflow-hidden">
      <div className="container h-full mx-auto overflow-hidden">
        <div className="mx-auto w-full bg-white px-8 py-12 font-Mulish drop-shadow-md sm:w-[454px]">
          <p className="text-main-dark-gray text-sm font-light">
            Welcome back! 👋
          </p>
          <h5 className="mb-7 text-2xl font-bold">Sign in to your account</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex justify-between mb-3">
                <label className="text-sm font-medium" htmlFor="email">
                  Your email
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
          Don’t have an account?{" "}
          <Link to="/sign-up" className="text-main-light-purple text-xs">
            Sign up
          </Link>
        </p>
      </div>
    </Wrapper>
  );
};

export default SignIn;
