import { User } from "src/types/user.type";

export const getProfileFromLS = () => {
  const result = localStorage.getItem("profile");
  return result ? JSON.parse(result) : null;
};
export const setProfileToLS = (profile: User | null) => {
  if (profile) {
    localStorage.setItem("profile", JSON.stringify(profile));
  } else {
    localStorage.removeItem("profile");
  }
};

export const formatPrice = (price: number | undefined) => {
  if (!price) return "0₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
