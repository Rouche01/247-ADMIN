import React, { useEffect } from "react";
import CenterModal from "./CenterModal";
import InputField from "./InputField";
import Button from "./Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSettlePayoutFormValidation } from "../../hooks/validationSchema";

const SettlePayoutModal = ({
  isOpen,
  setIsOpen,
  driverDeets,
  handlePayout,
}) => {
  const validationSchema = useSettlePayoutFormValidation();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    reset(driverDeets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverDeets]);

  return (
    <CenterModal modalOpen={isOpen} setModalOpen={setIsOpen} width={704}>
      <h2 className="text-center text-white text-2xl font-semibold">
        Settle Payout
      </h2>
      <form className="mt-10" onSubmit={handleSubmit(handlePayout)}>
        <InputField
          label="Account Number"
          darkMode={true}
          placeholder="enter account number"
          type="text"
          registerFn={register}
          name="accountNumber"
          errorText={errors.accountNumber?.message}
        />
        <InputField
          label="Bank Name"
          darkMode={true}
          placeholder="enter bank name"
          type="text"
          registerFn={register}
          name="bankName"
          errorText={errors.bankName?.message}
          disabled
        />
        <InputField
          label="Account Name"
          darkMode={true}
          placeholder="enter account name"
          type="text"
          registerFn={register}
          name="accountName"
          errorText={errors.accountName?.message}
          disabled
        />
        <InputField
          label="Pending Payout"
          darkMode={true}
          placeholder="enter amount to payout"
          type="text"
          isNumeric
          setValue={setValue}
          registerFn={register}
          name="pendingPayout"
          errorText={errors.pendingPayout?.message}
          disabled
        />
        <Button
          type="submit"
          className={["bg-247-red", "block", "mt-12", "px-12", "font-normal"]}
          fullWidth
        >
          Payout
        </Button>
      </form>
    </CenterModal>
  );
};

export default SettlePayoutModal;
