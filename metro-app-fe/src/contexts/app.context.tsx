/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import { useAccountMe } from "src/queries/useUser";
import { RegisterRequest, User } from "src/types/user.type";
import { getProfileFromLS, setProfileToLS } from "src/utils/utils";

interface AppContextInterface {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  profile: User | null;
  setProfile: (profile: User | null) => void;
  reset: () => void;
  registerData: RegisterRequest | null;
  setRegisterData: React.Dispatch<React.SetStateAction<RegisterRequest | null>>;
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getProfileFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  reset: () => null,
  registerData: null,
  setRegisterData: () => null,
};

export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialAppContext.isAuthenticated
  );
  const [profile, setProfile] = useState<User | null>(
    initialAppContext.profile
  );

  const [registerData, setRegisterData] = useState<RegisterRequest | null>(
    null
  );

  const { data, isSuccess, isError } = useAccountMe();

  const handleSetProfile = (profile: User | null) => {
    setProfile(profile);
    setProfileToLS(profile);
    setIsAuthenticated(Boolean(profile));
  };

  const reset = () => {
    setIsAuthenticated(false);
    setProfile(null);
    setProfileToLS(null);
  };
  useEffect(() => {
    if (isSuccess && data?.data?.data) {
      handleSetProfile(data.data.data);
    } else if (isError) {
      reset();
    }
  }, [isSuccess, isError, data]);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile: handleSetProfile,
        reset,
        registerData,
        setRegisterData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
