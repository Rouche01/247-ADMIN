import React, { useState, useEffect } from "react";
import CenterModal from "./CenterModal";
import InputField from "./InputField";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCampaignFormValidation } from "../../hooks/validationSchema";
import DateInput from "./DateInput";
import SelectInput from "./SelectInput";
import FileUploadInput from "./FileUploadInput";
import Button from "./Button";

const CreateCampaignModal = ({ modalIsOpen, setIsOpen, modalWidth }) => {
  const { validationSchema } = useCampaignFormValidation();
  const [campaignMedia, setCampaignMedia] = useState([]);

  const updateUploadedFile = (fileObject) => {
    const mediaContents = Object.values(fileObject);
    setCampaignMedia(mediaContents);
  };

  useEffect(() => {
    console.log(campaignMedia);
  }, [campaignMedia]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const onSubmit = async (data) => {
    console.log(data);
  };

  return (
    <CenterModal
      modalOpen={modalIsOpen}
      setModalOpen={setIsOpen}
      width={modalWidth}
    >
      <h2 className="text-2xl text-white text-center font-semibold">
        Create new campaign
      </h2>
      <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Campaign Name"
          darkMode={true}
          placeholder="enter campaign name"
          type="text"
          registerFn={register}
          name="campaignName"
          errorText={errors.campaignName?.message}
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Advertisers"
            darkMode={true}
            placeholder="enter advertiser’s name"
            type="text"
            registerFn={register}
            name="advertiserName"
            errorText={errors.advertiserName?.message}
          />
          <Controller
            name="duration"
            control={control}
            render={({ field }) => {
              console.log((field.value && field?.value[0]) || null);
              return (
                <DateInput
                  label="Duration"
                  darkMode
                  placeholder="Select campaign duration"
                  startDate={(field.value && field?.value[0]) || null}
                  endDate={(field.value && field?.value[0]) || null}
                  handleChange={(date) => field.onChange(date)}
                  errorText={errors.duration?.message}
                />
              );
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Ad Spend"
            darkMode={true}
            placeholder="enter campaign spend"
            type="text"
            registerFn={register}
            name="adSpend"
            errorText={errors.adSpend?.message}
          />
          <Controller
            name="adType"
            control={control}
            render={({ field }) => {
              console.log(field.value);
              return (
                <SelectInput
                  label="Ad Type"
                  darkMode
                  options={[
                    { value: "image", label: "Image" },
                    { value: "video", label: "Video" },
                  ]}
                  placeholderText="select ad type"
                  value={field.value}
                  handleChange={(value) => field.onChange(value)}
                />
              );
            }}
          />
        </div>
        <FileUploadInput
          label="Upload Content"
          multiple={false}
          callUpdateFilesCb={updateUploadedFile}
        />
        <Button
          type="submit"
          className={["bg-247-red", "block", "mt-12", "px-12", "font-normal"]}
          fullWidth
        >
          Create Campaign
        </Button>
      </form>
    </CenterModal>
  );
};

export default CreateCampaignModal;
