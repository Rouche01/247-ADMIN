import React, { useState, useContext } from "react";
import { format } from "date-fns";
import CenterModal from "./CenterModal";
import InputField from "./InputField";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Context as CampaignContext } from "../../context/CampaignContext";
import { useCampaignFormValidation } from "../../hooks/validationSchema";
import DateInput from "./DateInput";
import SelectInput from "./SelectInput";
import FileUploadInput from "./FileUploadInput";
import Button from "./Button";
import { useToastError } from "../../hooks/handleError";
import toast from "react-hot-toast";

const CreateCampaignModal = ({
  modalIsOpen,
  setIsOpen,
  modalWidth,
  isEdit,
  editData,
}) => {
  const { validationSchema } = useCampaignFormValidation();
  const {
    createCampaign,
    clearError,
    state: { loading: creatingCampaign, createErrorMsg },
  } = useContext(CampaignContext);
  const [campaignMedia, setCampaignMedia] = useState([]);

  const updateUploadedFile = (fileObject) => {
    const mediaContents = Object.values(fileObject);
    setCampaignMedia(mediaContents);
  };

  useToastError(createErrorMsg, clearError);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: isEdit && editData,
  });

  const onSubmit = async (data) => {
    let formData = new FormData();

    formData.append("campaignName", data.campaignName);
    formData.append("advertiser", data.advertiserName);
    formData.append("adBudget", data.adBudget);
    formData.append("adType", data.adType.value);
    formData.append(
      "duration",
      JSON.stringify([
        format(data.duration[0], "yyyy-MM-dd"),
        format(data.duration[1], "yyyy-MM-dd"),
      ])
    );

    formData.append("campaignMedia", campaignMedia[0]);

    await createCampaign(formData);
    toast.success("Campaign created successfully");
    setIsOpen(false);
  };

  return (
    <CenterModal
      modalOpen={modalIsOpen}
      setModalOpen={setIsOpen}
      width={modalWidth}
    >
      <h2 className="text-2xl text-white text-center font-semibold">
        {isEdit
          ? `Edit campaign (${editData.campaignName})`
          : "Create new campaign"}
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
              return (
                <DateInput
                  label="Duration"
                  darkMode
                  placeholder="Select campaign duration"
                  startDate={(field.value && field?.value[0]) || null}
                  endDate={(field.value && field?.value[1]) || null}
                  handleChange={(date) => field.onChange(date)}
                  errorText={errors.duration?.message}
                />
              );
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Ad Budget"
            darkMode={true}
            placeholder="enter campaign spend"
            type="string"
            registerFn={register}
            name="adBudget"
            errorText={errors.adBudget?.message}
          />
          <Controller
            name="adType"
            control={control}
            render={({ field }) => {
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
                  errorText={errors.adType?.message}
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
          isLoading={creatingCampaign}
        >
          {isEdit ? "Submit Change" : "Create Campaign"}
        </Button>
      </form>
    </CenterModal>
  );
};

export default CreateCampaignModal;
