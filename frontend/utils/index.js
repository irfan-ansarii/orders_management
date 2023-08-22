export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const getAvatarName = (name) => {
  if (!name) return;
  const full = name?.split(" ");
  let avatar = "";
  if (full?.length >= 2) {
    avatar = `${full?.[0]?.charAt(0)}${full?.[1]?.charAt(0)}`;
  } else {
    avatar = full?.[0]?.substring(0, 2);
  }
  return avatar.toUpperCase();
};

export const getAppConfig = () => {
  return {
    appTitle: process.env.NEXT_PUBLIC_APP_TITLE,
    appDescription: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
    loginURL: process.env.NEXT_PUBLIC_LOGIN_URL,
    forgetPasswordURL: process.env.NEXT_PUBLIC_FORGET_PASSWORD_URL,
    resetPasswordURL: process.env.NEXT_PUBLIC_RESET_PASSWORD_URL,
    adminURL: process.env.NEXT_PUBLIC_ADMIN_URL,
    staffURL: process.env.NEXT_PUBLIC_STAFF_URL,
    riderURL: process.env.NEXT_PUBLIC_RIDER_URL,
    apiURL: process.env.NEXT_PUBLIC_API_URL,
  };
};
export function getMediaURL(url) {
  if (!url) {
    return null;
  }
  if (url.startsWith("http") || url.startsWith("//")) {
    return url;
  }
  return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337"}${url}`;
}

export function getFileURL(url) {
  if (!url) {
    return null;
  }
  if (url.startsWith("http") || url.startsWith("//")) {
    return url;
  }
  return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337"}${url}`;
}

export function getApiURL() {
  return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337"}/api`;
}
