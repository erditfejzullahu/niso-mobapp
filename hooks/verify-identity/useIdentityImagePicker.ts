import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useCallback } from "react";
import { Alert } from "react-native";

type ImageField = "selfie" | "idFront" | "idBack";

async function compressToWebp(uri: string) {
  const imageContext = ImageManipulator.ImageManipulator.manipulate(uri);
  const image = await imageContext.renderAsync();
  const result = await image.saveAsync({
    compress: 0.7,
    format: ImageManipulator.SaveFormat.WEBP,
  });
  return result.uri;
}

export function useIdentityImagePicker(opts: {
  onPicked: (field: ImageField, uri: string) => void;
  onPickFailed?: (field: ImageField) => void;
}) {
  const pickFromLibrary = useCallback(async (field: ImageField) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Leje e nevojshme", "Ju lutem jepni leje për të hapur galerinë.");
      return;
    }

    const imagePicked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (imagePicked.canceled) return;

    try {
      const uri = await compressToWebp(imagePicked.assets[0]!.uri);
      opts.onPicked(field, uri);
    } catch (e) {
      console.error("error converting image ", e);
      opts.onPickFailed?.(field);
    }
  }, [opts]);

  const takeSelfie = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Leje e nevojshme", "Ju lutem jepni leje për kamerën.");
      return;
    }

    const imagePicked = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (imagePicked.canceled) return;

    try {
      const uri = await compressToWebp(imagePicked.assets[0]!.uri);
      opts.onPicked("selfie", uri);
    } catch (e) {
      console.error("error converting image ", e);
      opts.onPickFailed?.("selfie");
    }
  }, [opts]);

  return { pickFromLibrary, takeSelfie };
}

