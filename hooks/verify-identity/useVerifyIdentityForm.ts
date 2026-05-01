import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { verifyIdentitySchema, type VerifyIdentityFormValues } from "@/schemas/verifyIdentitySchema";

export function useVerifyIdentityForm() {
  return useForm<VerifyIdentityFormValues>({
    resolver: zodResolver(verifyIdentitySchema),
    defaultValues: {
      address: "",
      city: "",
      gender: "MALE",
      selfie: "",
      idFront: "",
      idBack: "",
    },
    mode: "onChange",
    criteriaMode: "all",
  });
}

