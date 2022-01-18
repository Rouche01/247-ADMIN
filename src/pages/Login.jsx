import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import InputField from "../components/uiComponents/InputField";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { useForm } from "react-hook-form";
import Button from "../components/uiComponents/Button";
import Logo from "../assets/logo.png";
import { Context as AuthContext } from "../context/AuthContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLoginValidation } from "../hooks/validationSchema";
import { OVERVIEW_PAGE } from "../routes/pageUrls";

const Login = () => {
  const { validationSchema } = useLoginValidation();
  const { state } = useLocation();

  const {
    state: { loading: authLoading, error: authError },
    loginAdmin,
    clearError,
  } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = async (data) => {
    console.log(data);
    clearError();
    const { emailAddress, password } = data;
    const forwardedPath = state?.from || OVERVIEW_PAGE;
    await loginAdmin({ email: emailAddress, password }, forwardedPath);
  };

  return (
    <div className="grid grid-cols-6 gap-0 h-screen min-h-screen">
      <div className="col-span-3 bg-247-main h-full flex">
        <img src={Logo} alt="logo" width="340" className="m-auto" />
      </div>
      <div className="col-span-3 bg-247-transparent flex">
        <div className="px-20 w-full items-center m-auto">
          <h1 className="text-5xl font-bold text-247-dark-text font-customRoboto">
            Sign In
          </h1>
          <p className="text-2xl text-247-dark-text font-customRoboto font-light mt-1 tracking-wide">
            Welcome Back
          </p>
          <form className="mt-20" onSubmit={handleSubmit(onSubmit)}>
            {authError && (
              <p className="font-semibold text-247-error-text">{authError}</p>
            )}
            <InputField
              placeholder="Email Address"
              type="email"
              inputIcon={<HiOutlineMail size={24} color="#4D4D4D" />}
              registerFn={register}
              name="emailAddress"
              errorText={errors.emailAddress?.message}
            />
            <InputField
              placeholder="Password"
              type="password"
              inputIcon={<RiLockPasswordLine size={24} color="#4D4D4D" />}
              registerFn={register}
              name="password"
              errorText={errors.password?.message}
            />
            <Button
              fullWidth
              className={["mt-20", "bg-247-main"]}
              type="submit"
              isLoading={authLoading}
            >
              Log In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
