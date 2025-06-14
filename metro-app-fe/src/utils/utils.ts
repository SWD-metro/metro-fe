import { User } from "src/types/user.type";

export const getProfileFromLS = () => {
  const result = localStorage.getItem("profile");
  return result ? JSON.parse(result) : null;
};
export const setProfileToLS = (profile: User | null) => {
  localStorage.setItem("profile", JSON.stringify(profile));
};
