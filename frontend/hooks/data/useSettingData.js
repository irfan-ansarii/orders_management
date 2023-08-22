import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import {
  getPlatforms,
  createPlatform,
  editPlatform,
  getSettings,
  editSettings,
  deleteFile,
  getPublic,
} from "../../utils/api/setting";

// get platforms
export const usePlatformsData = () => {
  return useSWR(`/platforms?populate=*`, getPlatforms);
};

// create platforms
export const useCreatePlatform = () => {
  return useSWRMutation(`/platforms/`, createPlatform);
};

// edit platforms
export const useEditPlatform = () => {
  return useSWRMutation(`/platforms/`, editPlatform);
};

// get settings data
export const useSettingsData = () => {
  return useSWR(`/setting?populate=*`, getSettings);
};
// get settings data
export const useEditSettings = () => {
  return useSWRMutation(`/setting`, editSettings);
};

// get public data
export const usePublicData = () => {
  return useSWR(`/public?populate=*`, getPublic);
};

// update settings data
export const useEditPublic = () => {
  return useSWRMutation(`/public`, editSettings);
};

// delete file
export const useDeleteFile = () => {
  return useSWRMutation(`/upload/files/`, deleteFile);
};
