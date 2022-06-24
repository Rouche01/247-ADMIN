import React, { useState, useContext } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import CenterModal from "./CenterModal";
import InputField from "./InputField";
import { Context as CampaignContext } from "../../context/CampaignContext";
import { useCampaignFormValidation } from "../../hooks/validationSchema";
import DateInput from "./DateInput";
import SelectInput from "./SelectInput";
import FileUploadInput from "./FileUploadInput";
import Button from "./Button";
import { useToastError } from "../../hooks/handleError";
import AsyncSelectInput from "./AsyncSelectInput";
import adverts247Api from "../../apiService/adverts247Api";
import { resolveToken } from "../../utils/resolveToken";

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
  const [inputLoading, setInputLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const updateUploadedFile = (fileObject) => {
    const mediaContents = Object.values(fileObject);
    setCampaignMedia(mediaContents);
  };

  useToastError(createErrorMsg, () => {
    clearError("create");
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: isEdit && editData,
  });

  const fetchAdvertiserList = async (inputValue) => {
    const response = await adverts247Api.get(
      `/advertisers${inputValue ? `?startsWith=${inputValue}` : ""}`,
      {
        headers: { Authorization: `Bearer ${resolveToken()}` },
      }
    );

    return response.data.advertisers;
  };

  const createNewAdvertiser = async (inputValue) => {
    setInputLoading(true);
    try {
      const response = await adverts247Api.post(
        "/advertisers",
        {
          companyName: inputValue,
        },
        { headers: { Authorization: `Bearer ${resolveToken()}` } }
      );
      setInputLoading(false);
      setValue("advertiser", response.data);
    } catch (err) {
      console.log(err.response);
      if (err.response) {
        setError("advertiser", {
          message:
            err.response.data.message ||
            "Unable to create advertiser, try again",
        });
      } else {
        setError("advertiser", {
          message: "Unable to create new advertiser, try again",
        });
      }
      setInputLoading(false);
    }
  };

  const onSubmit = async (data) => {
    let formData = new FormData();

    if (campaignMedia[0]) {
      formData.append("campaignName", data.campaignName);
      formData.append("advertiser", data.advertiser.id);
      formData.append("adBudget", parseFloat(data.adBudget.replace(/,/g, "")));
      formData.append("adType", data.adType.value);
      formData.append(
        "duration",
        JSON.stringify([
          format(data.duration[0], "yyyy-MM-dd"),
          format(data.duration[1], "yyyy-MM-dd"),
        ])
      );

      formData.append("campaignMedia", campaignMedia[0]);

      await createCampaign(formData, () =>
        toast.success("Campaign created successfully")
      );
      setIsOpen(false);
    } else {
      toast.error("You need to upload a content for the campaign");
    }
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
          <Controller
            name="advertiser"
            control={control}
            render={({ field }) => {
              return (
                <AsyncSelectInput
                  label="Advertiser"
                  handleChange={(value) => field.onChange(value)}
                  darkMode
                  placeholderText="Enter advertiser name..."
                  value={field.value}
                  loadOptionFn={fetchAdvertiserList}
                  createNewOption={createNewAdvertiser}
                  getOptionLabel={(e) =>
                    e.__isNew__ ? e.label : e.companyName
                  }
                  getOptionValue={(e) => (e.__isNew__ ? e.value : e.id)}
                  loading={inputLoading}
                  errorText={errors.advertiser?.message}
                  inputValue={inputValue}
                  onInputValueChange={(value) => {
                    clearErrors("advertiser");
                    setInputValue(value);
                  }}
                />
              );
            }}
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
            setValue={setValue}
            isNumeric
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
