/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";
import { User } from "src/types/user.type";
import { getProfileFromLS, setProfileToLS } from "src/utils/utils";

interface AppContextInterface {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  profile: User | null;
  setProfile: (profile: User | null) => void;
  reset: () => void;
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getProfileFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  reset: () => null,
};

export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialAppContext.isAuthenticated
  );
  const [profile, setProfile] = useState<User | null>(
    initialAppContext.profile
  );

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

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile: handleSetProfile,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
