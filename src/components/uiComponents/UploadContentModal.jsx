import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import InputField from "./InputField";
import Button from "./Button";
import FileUploadInput from "./FileUploadInput";
import { useForm } from "react-hook-form";
import { useUploadContentFormValidation } from "../../hooks/validationSchema";
import CenterModal from "./CenterModal";

const UploadContentModal = ({
  isOpen,
  setIsOpen,
  handleUpload,
  setMediaItem,
  setMediaDuration,
  creatingContent
}) => {
  const validationSchema = useUploadContentFormValidation();
  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const updateUploadedFile = (fileObject) => {
    const mediaContents = Object.values(fileObject);
    setMediaItem(mediaContents);
  };

  return (
    <CenterModal modalOpen={isOpen} setModalOpen={setIsOpen} width={704}>
      <h2 className="text-white text-2xl font-semibold text-center">
        Upload Content
      </h2>
      <form className="mt-10" onSubmit={handleSubmit(handleUpload)}>
        <InputField
          label="Title"
          darkMode={true}
          placeholder="enter title"
          type="string"
          registerFn={register}
          name="title"
          errorText={errors.title?.message}
        />
        <InputField
          label="Category"
          darkMode={true}
          placeholder="enter category"
          type="string"
          registerFn={register}
          name="category"
          errorText={errors.category?.message}
        />
        <FileUploadInput
          label="Upload Content"
          multiple={false}
          callUpdateFilesCb={updateUploadedFile}
          accepts=".mp4"
          setDuration={setMediaDuration}
        />
        <Button
          type="submit"
          className={["bg-247-red", "block", "mt-12", "px-12", "font-normal"]}
          fullWidth
          isLoading={creatingContent}
        >
          Upload
        </Button>
      </form>
    </CenterModal>
  );
};

export default UploadContentModal;
