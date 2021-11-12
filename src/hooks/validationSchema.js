import * as Yup from "yup";

export const useLoginValidation = () => {
  const validationSchema = Yup.object({
    emailAddress: Yup.string()
      .email("Must be a valid email")
      .required("Email is required"),
    password: Yup.string().min(7).max(255).required("Password is required"),
  });

  return { validationSchema };
};
