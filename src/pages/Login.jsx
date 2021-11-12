import React from "react";
import InputField from "../components/uiComponents/InputField";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { useForm } from "react-hook-form";
import Button from "../components/uiComponents/Button";
import Logo from "../assets/logo.png";

import { yupResolver } from "@hookform/resolvers/yup";
import { useLoginValidation } from "../hooks/validationSchema";

const Login = () => {
  const { validationSchema } = useLoginValidation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  console.log(watch("emailAddress"));

  const onSubmit = (data) => {
    console.log(data);
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
            <Button className={["mt-20"]} type="submit">
              Log In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
