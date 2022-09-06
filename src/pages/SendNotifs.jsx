import { yupResolver } from "@hookform/resolvers/yup";
import React, { useContext } from "react";
import { useForm, Controller } from "react-hook-form";

import Dashboard from "../components/Dashboard";
import Button from "../components/uiComponents/Button";
import TextArea from "../components/uiComponents/TextArea";
import { Context as AuthContext } from "../context/AuthContext";
import { useSendNotifFormValidation } from "../hooks/validationSchema";

import { useNotification } from "../hooks/notificationSubscriptions";
import { NOTIFICATION_EVENTS } from "../utils/constants";
import InputField from "../components/uiComponents/InputField";
import toast from "react-hot-toast";

const SendNotifs = () => {
  const validationSchema = useSendNotifFormValidation();
  const {
    handleSubmit,
    register,
    formState: { errors, isDirty, isSubmitting },
    control,
    reset,
    setValue,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const {
    state: { user },
  } = useContext(AuthContext);

  const { emitEvent } = useNotification();

  const handleNotificationBroadcast = (data) => {
    emitEvent(NOTIFICATION_EVENTS.DRIVER_BROADCAST, {
      message: data.message,
      sender: user.id,
      subject: data.subject,
    });
    toast.success("Message broadcasted to drivers successfully!");
    reset();
    setValue("message", "");
  };

  return (
    <Dashboard pageTitle="Send Notifs">
      <form
        className="mt-14 max-w-3xl"
        onSubmit={handleSubmit(handleNotificationBroadcast)}
      >
        <InputField
          darkMode={true}
          placeholder="Enter subject"
          type="text"
          registerFn={register}
          name="subject"
          errorText={errors.subject?.message}
        />
        <div className="mt-8">
          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <TextArea
                name="notif-text"
                value={field.value}
                handleChange={(ev) => field.onChange(ev.target.value)}
                errorText={errors.message?.message}
              />
            )}
          />
        </div>
        <Button
          type="submit"
          className={["bg-247-red", "block", "mt-12", "px-10"]}
          disabled={!isDirty}
          isLoading={isSubmitting}
        >
          Send Notification
        </Button>
      </form>
    </Dashboard>
  );
};

export default SendNotifs;
