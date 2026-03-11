import { yupResolver } from "@hookform/resolvers/yup";
import type {
  Control,
  DefaultValues,
  FieldErrors,
  FieldValues,
  UseFormHandleSubmit,
  UseFormWatch,
} from "react-hook-form";
import { useForm } from "react-hook-form";
import type { ObjectSchema } from "yup";

export interface RValidationService<TFormValues extends FieldValues> {
  control: Control<TFormValues>;
  handleSubmit: UseFormHandleSubmit<TFormValues>;
  watch: UseFormWatch<TFormValues>;
  formState: {
    isValid: boolean;
    errors: FieldErrors<TFormValues>;
  };
}

export interface UseValidationOptions<TFormValues extends FieldValues> {
  defaultValues?: DefaultValues<TFormValues>;
}

export function useValidation<TFormValues extends FieldValues>(
  schema: ObjectSchema<TFormValues>,
  options?: UseValidationOptions<TFormValues>,
): RValidationService<TFormValues> {
  const { control, handleSubmit, watch, formState } = useForm<TFormValues>({
    mode: "onChange",
    resolver: yupResolver(schema) as any,
    defaultValues: options?.defaultValues,
  });

  return {
    control,
    handleSubmit,
    watch,
    formState: {
      isValid: formState.isValid,
      errors: formState.errors,
    }
  };
}
