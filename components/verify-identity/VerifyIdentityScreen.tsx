import { useAuth } from "@/context/AuthContext";
import api from "@/hooks/useApi";
import { getFieldErrorMessages } from "@/hooks/verify-identity/getFieldErrorMessages";
import { useIdentityImagePicker } from "@/hooks/verify-identity/useIdentityImagePicker";
import { useKosovoCitiesAutocomplete } from "@/hooks/verify-identity/useKosovoCitiesAutocomplete";
import { useVerifyIdentityForm } from "@/hooks/verify-identity/useVerifyIdentityForm";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import {
  Dimensions,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import Toast from "@/utils/appToast";
import { CityAutocompleteField } from "./CityAutocompleteField";
import { GenderSelector } from "./GenderSelector";
import { ImageUploadSection } from "./ImageUploadSection";
import type { VerifyIdentityFormValues } from "@/schemas/verifyIdentitySchema";

export default function VerifyIdentityScreen() {
  const { height } = Dimensions.get("window");
  const scrollY = useSharedValue(0);
  const handleScroll = useCallback((event: any) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  }, [scrollY]);

  const backgroundLayer = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scrollY.value, [0, height * 0.5], [0, -100], Extrapolation.CLAMP),
      },
    ],
    opacity: interpolate(scrollY.value, [0, height * 0.3], [1, 0.8], Extrapolation.CLAMP),
  }));

  const { user, updateSession, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      router.replace("/(auth)/sign-in");
      return;
    }
    if (user.user_verified) {
      router.replace(user.role === "DRIVER" ? "/driver/section/active-routes" : "/client/section/client-home");
    }
  }, [user]);

  const { control, handleSubmit, setValue, watch, formState } = useVerifyIdentityForm();
  const { errors, isSubmitting } = formState;

  const selfie = watch("selfie");
  const idFront = watch("idFront");
  const idBack = watch("idBack");

  const [uploading, setUploading] = useState(false);

  const { citiesShown, showDropdown, setShowDropdown, filter } = useKosovoCitiesAutocomplete();

  const onPicked = useCallback((field: "selfie" | "idFront" | "idBack", uri: string) => {
    setValue(field, uri, { shouldValidate: true, shouldDirty: true });
  }, [setValue]);
  const { pickFromLibrary, takeSelfie } = useIdentityImagePicker({
    onPicked,
    onPickFailed: (field) => setValue(field, "", { shouldValidate: true }),
  });

  const appendImage = useCallback((formData: FormData, fieldName: string, uri: string, fallback: string) => {
    const filename = uri.split("/").pop() || fallback;
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";
    formData.append(fieldName, { uri, name: filename, type } as any);
  }, []);

  const onSubmit = useCallback(
    async (data: VerifyIdentityFormValues) => {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("address", data.address);
        formData.append("city", data.city);
        formData.append("gender", data.gender);

        appendImage(formData, "selfie", data.selfie, "selfie.jpg");
        appendImage(formData, "id_card", data.idFront, "id_front.jpg");
        appendImage(formData, "id_card", data.idBack, "id_back.jpg");

        const res = await api.post("/auth/verify-identity", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data?.success) {
          await updateSession();
        }

        Toast.show({ type: "success", text1: "Identiteti u verifikua me sukses!" });
      } catch (error: any) {
        console.log(error?.response?.data?.message);
        console.error("Verification error:", error);
        Toast.show({
          type: "error",
          text1: "Diçka shkoi keq. Ju lutem provoni përsëri.",
          text2: error?.response?.data?.message || "Unknown error",
        });
      } finally {
        setUploading(false);
      }
    },
    [appendImage, updateSession]
  );

  const submit = useMemo(() => handleSubmit(onSubmit), [handleSubmit, onSubmit]);

  const onFocusCity = useCallback(() => setShowDropdown(true), [setShowDropdown]);
  const onRemoveImage = useCallback(
    (field: "selfie" | "idFront" | "idBack") => setValue(field, "", { shouldValidate: true, shouldDirty: true }),
    [setValue]
  );
  const onPickImage = useCallback((field: "selfie" | "idFront" | "idBack") => pickFromLibrary(field), [pickFromLibrary]);
  const onSelectCity = useCallback(
    (selected: string) => {
      setValue("city", selected, { shouldValidate: true, shouldDirty: true });
      setShowDropdown(false);
    },
    [setShowDropdown, setValue]
  );
  const onChangeCityText = useCallback(
    (fieldOnChange: (v: string) => void) => (text: string) => {
      fieldOnChange(text);
      filter(text);
      setShowDropdown(true);
    },
    [filter, setShowDropdown]
  );

  return (
    <View className="flex-1 bg-gray-100">
      <Animated.View className="absolute w-full h-96" style={backgroundLayer}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
          }}
          className="flex-1"
          blurRadius={2}
        >
          <View className="absolute inset-0 bg-black/85 opacity-80" />
        </ImageBackground>
      </Animated.View>

      <KeyboardAwareScrollView className="flex-1" onScroll={handleScroll} scrollEventThrottle={16}>
        <View className="h-64" />

        <View className="bg-white mx-6 rounded-3xl p-8 shadow-md shadow-black/15">
          <View className="items-center mb-10">
            <Text className="text-3xl font-pbold pt-3 text-indigo-600">Verifikoni Identitetin</Text>
            <Text className="text-gray-600 font-pregular text-center mt-2">
              Plotësoni informacionin e mëposhtëm për të verifikuar identitetin tuaj
            </Text>
          </View>

          <View className="mb-6 border-b border-gray-200">
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <>
                  <Text className="text-gray-700 mb-1 font-pmedium">Adresa</Text>
                  <TextInput
                    className="text-gray-800 h-[35px] font-pregular"
                    placeholder="Shkruani adresën tuaj të plotë"
                    placeholderTextColor="#9CA3AF"
                    value={field.value}
                    onChangeText={(v) => field.onChange(v)}
                  />
                </>
              )}
            />
            {getFieldErrorMessages(errors.address).map((m) => (
              <Text key={m} className="text-xs font-plight text-red-500 mt-1">
                {m}
              </Text>
            ))}
          </View>

          <Controller
            control={control}
            name="city"
            render={({ field }) => (
              <CityAutocompleteField
                label="Qyteti"
                placeholder="Shkruani qytetin"
                value={field.value}
                onChangeText={onChangeCityText(field.onChange)}
                onFocus={onFocusCity}
                citiesShown={citiesShown}
                showDropdown={showDropdown}
                onSelectCity={onSelectCity}
                errorMessages={getFieldErrorMessages(errors.city)}
              />
            )}
          />

          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <>
                <GenderSelector value={field.value} onChange={(v) => field.onChange(v)} />
                {getFieldErrorMessages(errors.gender).map((m) => (
                  <Text key={m} className="text-xs font-plight text-red-500 -mt-4 mb-6">
                    {m}
                  </Text>
                ))}
              </>
            )}
          />

          <ImageUploadSection
            selfie={selfie}
            idFront={idFront}
            idBack={idBack}
            onTakeSelfie={takeSelfie}
            onPick={onPickImage}
            onRemove={onRemoveImage}
            selfieErrors={getFieldErrorMessages(errors.selfie)}
            idFrontErrors={getFieldErrorMessages(errors.idFront)}
            idBackErrors={getFieldErrorMessages(errors.idBack)}
          />

          <TouchableOpacity
            onPress={submit}
            disabled={isSubmitting || uploading}
            className={`bg-indigo-600 rounded-full p-4 items-center mt-4 ${(isSubmitting || uploading) && "opacity-50"}`}
            activeOpacity={0.9}
          >
            <Text className="text-white font-pbold text-lg">
              {isSubmitting || uploading ? "Po verifikohet..." : "Verifiko Identitetin"}
            </Text>
          </TouchableOpacity>

          <View className="mt-8 items-center">
            <Text className="text-gray-600 font-pregular">Deshironi te shkyceni? </Text>
            <TouchableOpacity
              onPress={async () => {
                await logout();
                router.replace("/(auth)/sign-in");
              }}
            >
              <Text className="text-indigo-600 font-psemibold">Shkycu</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="h-20" />
      </KeyboardAwareScrollView>
    </View>
  );
}

