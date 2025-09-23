import { createContext, useState, useContext, useEffect } from "react";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import { Alert, Linking } from "react-native";
import { API_BASE_URL } from "@/constants/apiConfig";

interface RecordingContextType {
  audioUri: string | null;
  setAudioUri: (uri: string | null) => void;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  hasPermission: boolean | null;
    sendRecording: (uri: string) => Promise<void>;
}

const RecordingContext = createContext<RecordingContextType | undefined>(
  undefined
);

export const RecordingContextProvider = ({ children }: any) => {
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const setupAudio = async () => {
      try {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        setHasPermission(status.granted);
        if (!status.granted) {
          Alert.alert(
            "Microphone access required",
            "Please enable microphone permission in your device settings.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: () => Linking.openSettings() },
            ]
          );
          return;
        }
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: true,
        });
      } catch (error) {
        console.error("Error setting up audio", error);
        setHasPermission(false);
      }
    };
    setupAudio();
  }, []);

  const startRecording = async () => {
    if (!hasPermission) {
      Alert.alert(
        "Microphone access required",
        "Please enable microphone permission in settings",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async (): Promise<string | null> => {
    await audioRecorder.stop();
    const uri = audioRecorder.uri;
    setAudioUri(uri);
    console.log("Recording stopped, file saved at: ", audioRecorder.uri);
    return uri;
  };

  const sendRecording = async (uri: string) => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri,
        name: "recording.m4a",
        type: "audio/m4a",
      } as any);

      const response = await fetch(`${API_BASE_URL}/api/visualise/recordUpload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) throw new Error("Upload failed");
      console.log("Recording uploaded successfully!");
    } catch (err) {
      console.error("Error uploading recording:", err);
    }
  };

  return (
    <RecordingContext.Provider
      value={{
        audioUri,
        setAudioUri,
        startRecording,
        stopRecording,
        hasPermission,
        sendRecording
      }}
    >
      {children}
    </RecordingContext.Provider>
  );
};

export const useRecording = () => {
  const context = useContext(RecordingContext);
  if (!context) {
    throw new Error(
      "useRecording must be used within a RecordingContextProvider"
    );
  }
  return context;
};
