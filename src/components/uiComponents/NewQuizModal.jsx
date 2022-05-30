import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNewQuizFormValidation } from "../../hooks/validationSchema";
import CenterModal from "./CenterModal";
import SelectInput from "./SelectInput";
import InputField from "./InputField";
import FileUploadInput from "./FileUploadInput";
import Button from "./Button";

const NewQuizModal = ({ isOpen, setIsOpen, submitAction }) => {
  const validationSchema = useNewQuizFormValidation();
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm({ resolver: yupResolver(validationSchema) });

  const [quizMedia, setQuizMedia] = useState([]);

  const updateUploadedFile = (fileObject) => {
    const mediaContents = Object.values(fileObject);
    setQuizMedia(mediaContents);
  };

  return (
    <CenterModal modalOpen={isOpen} setModalOpen={setIsOpen} width={704}>
      <h3 className="text-white text-center text-2xl font-semibold">
        New Quiz
      </h3>
      <form className="mt-10" onSubmit={handleSubmit(submitAction)}>
        <InputField
          label="Question"
          darkMode={true}
          placeholder="enter quiz question"
          type="text"
          registerFn={register}
          name="question"
          errorText={errors.question?.message}
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Option A"
            darkMode={true}
            placeholder="enter option a"
            type="text"
            registerFn={register}
            name="optionA"
            errorText={errors.optionA?.message}
          />
          <InputField
            label="Option B"
            darkMode={true}
            placeholder="enter option b"
            type="text"
            registerFn={register}
            name="optionB"
            errorText={errors.optionB?.message}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Option C"
            darkMode={true}
            placeholder="enter option c"
            type="text"
            registerFn={register}
            name="optionC"
            errorText={errors.optionC?.message}
          />
          <InputField
            label="Option D"
            darkMode={true}
            placeholder="enter option d"
            type="text"
            registerFn={register}
            name="optionD"
            errorText={errors.optionD?.message}
          />
        </div>
        <Controller
          name="correctOption"
          control={control}
          render={({ field }) => (
            <SelectInput
              label="Select Correct Option"
              darkMode
              options={[
                { value: "a", label: "A" },
                { value: "b", label: "B" },
                { value: "c", label: "C" },
                { value: "d", label: "D" },
              ]}
              placeholderText="select the correct option"
              value={field.value}
              handleChange={(value) => field.onChange(value)}
              errorText={errors.correctOption?.message}
            />
          )}
        />
        <FileUploadInput
          label="Upload Quiz Image"
          multiple={false}
          callUpdateFilesCb={updateUploadedFile}
        />
        <Button
          type="submit"
          className={["bg-247-red", "block", "mt-12", "px-12", "font-normal"]}
          fullWidth
        >
          Submit Quiz
        </Button>
      </form>
    </CenterModal>
  );
};

export default NewQuizModal;
