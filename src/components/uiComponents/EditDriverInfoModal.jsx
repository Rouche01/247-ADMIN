import React, { useEffect } from "react";
import CenterModal from "./CenterModal";
import InputField from "./InputField";
import Button from "./Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDriverInfoFormValidation } from "../../hooks/validationSchema";

const EditDriverInfoModal = ({
  isOpen,
  setIsOpen,
  isEdit,
  editData,
  submitAction,
}) => {
  const validationSchema = useDriverInfoFormValidation();
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm({ resolver: yupResolver(validationSchema) });

  useEffect(() => {
    reset(editData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData]);

  return (
    <CenterModal modalOpen={isOpen} setModalOpen={setIsOpen} width={704}>
      <h2 className="text-white text-center text-2xl font-semibold">
        Edit Contact Info
      </h2>
      <form className="mt-10" onSubmit={handleSubmit(submitAction)}>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="First Name"
            darkMode={true}
            placeholder="enter first name"
            type="text"
            registerFn={register}
            name="firstName"
            errorText={errors.firstName?.message}
          />
          <InputField
            label="Last Name"
            darkMode={true}
            placeholder="enter last name"
            type="text"
            registerFn={register}
            name="lastName"
            errorText={errors.lastName?.message}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Email Address"
            darkMode={true}
            placeholder="enter email address"
            type="text"
            registerFn={register}
            name="emailAddress"
            errorText={errors.emailAddress?.message}
          />
          <InputField
            label="Phone Number"
            darkMode={true}
            placeholder="enter phone number"
            type="text"
            registerFn={register}
            name="phoneNumber"
            errorText={errors.phoneNumber?.message}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Favourite Meal"
            darkMode={true}
            placeholder="enter favourite meal"
            type="text"
            registerFn={register}
            name="favouriteMeal"
            errorText={errors.favouriteMeal?.message}
          />
          <InputField
            label="Hobby"
            darkMode={true}
            placeholder="enter hobby"
            type="text"
            registerFn={register}
            name="hobby"
            errorText={errors.hobby?.message}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Ask Me About"
            darkMode={true}
            placeholder="what are you passionate about?"
            type="text"
            registerFn={register}
            name="askMeAbout"
            errorText={errors.askMeAbout?.message}
          />
          <InputField
            label="Vacation Spot"
            darkMode={true}
            placeholder="enter your vacation spot"
            type="text"
            registerFn={register}
            name="vacationSpot"
            errorText={errors.vacationSpot?.message}
          />
        </div>
        <Button
          type="submit"
          className={["bg-247-red", "block", "mt-12", "px-12", "font-normal"]}
          fullWidth
        >
          {isEdit ? "Save Changes" : "Create New Driver"}
        </Button>
      </form>
    </CenterModal>
  );
};

export default EditDriverInfoModal;
