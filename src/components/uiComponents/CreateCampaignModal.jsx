import React, { useState, useContext } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaTrash } from "react-icons/fa";
import pickBy from "lodash/pickBy";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";

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
import { ADTYPES } from "../../utils/constants";

const EditCampaignPreviewImage = ({ imgSrc, onRemoveExistingMedia, label }) => {
  return (
    <div className="mt-8">
      <label className="mb-2 font-medium inline-block text-white text-base">
        {label}{" "}
        <span className="text-xs font-normal ml-3">
          (PNG, JPG, AND MP4 Files Supported)
        </span>
      </label>
      <div className="rounded-md w-full bg-247-dark-mode-input-bg p-4">
        {" "}
        <div className="w-full max-h-52 rounded-md relative group">
          <div className="absolute flex items-end justify-end rounded-md w-full h-full group-hover:visible group-hover:bg-247-overlay">
            <div
              onClick={onRemoveExistingMedia}
              className="bg-white flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100  w-10 h-10 rounded-md mr-5 mb-5"
            >
              <FaTrash size={16} color="#f00" />
            </div>
          </div>
          <div>
            <img
              className="max-h-52 w-full object-cover rounded-md"
              src={imgSrc}
              alt={`campaign preview`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CreateCampaignModal = ({
  modalIsOpen,
  setIsOpen,
  modalWidth,
  isEdit,
  editData,
  editFn,
  editing,
  fetchCallback,
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

  const [updatingMedia, setUpdatingMedia] = useState(false);

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
    isEdit ? await onEditCampaign(data) : await onCampaignCreate(data);
  };

  const onCampaignCreate = async (data) => {
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

      await createCampaign(formData, () => {
        toast.success("Campaign created successfully");
        return fetchCallback();
      });
      setIsOpen(false);
    } else {
      toast.error("You need to upload a content for the campaign");
    }
  };

  const onEditCampaign = async (data) => {
    console.log(data);
    const diff = pickBy(data, (val, key) => !isEqual(editData[key], val));
    if (isEmpty(diff) && !campaignMedia[0]) {
      toast.error("You haven't made any changes!");
      return;
    }
    const formData = new FormData();

    for (let key in diff) {
      switch (key) {
        case "campaignName":
          formData.append("campaignName", diff[key]);
          break;
        case "duration":
          const transformedDuration = JSON.stringify([
            format(diff[key][0], "yyyy-MM-dd"),
            format(diff[key][1], "yyyy-MM-dd"),
          ]);
          formData.append("duration", transformedDuration);
          break;
        case "adBudget":
          const transformedBudget = parseFloat(diff[key].replace(/,/g, ""));
          formData.append("adBudget", transformedBudget);
          break;
        case "adType":
          formData.append("adType", diff[key].value);
          break;
        default:
          return;
      }
    }

    if (campaignMedia[0]) {
      formData.append("campaignMedia", campaignMedia[0]);
    }

    await editFn(formData);
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
          <Controller
            name="advertiser"
            control={control}
            render={({ field }) => {
              return (
                <AsyncSelectInput
                  label="Advertiser"
                  disabled={isEdit}
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
                  minDate={new Date()}
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
                  options={ADTYPES}
                  placeholderText="select ad type"
                  value={field.value}
                  handleChange={(value) => field.onChange(value)}
                  errorText={errors.adType?.message}
                />
              );
            }}
          />
        </div>
        {isEdit && !updatingMedia ? (
          <EditCampaignPreviewImage
            label="Upload Content"
            imgSrc={editData.preview}
            onRemoveExistingMedia={() => setUpdatingMedia(true)}
          />
        ) : (
          <FileUploadInput
            label="Upload Content"
            multiple={false}
            callUpdateFilesCb={updateUploadedFile}
            isEdit={isEdit}
            resetToDefault={() => {
              setCampaignMedia([]);
              setUpdatingMedia(false);
            }}
          />
        )}
        <Button
          type="submit"
          className={["bg-247-red", "block", "mt-12", "px-12", "font-normal"]}
          fullWidth
          isLoading={creatingCampaign || editing}
        >
          {isEdit ? "Submit Change" : "Create Campaign"}
        </Button>
      </form>
    </CenterModal>
  );
};

export default CreateCampaignModal;
