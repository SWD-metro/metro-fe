import React, { useContext } from "react";
import { Dropdown, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppContext } from "src/contexts/app.context";
import { useLogoutMutation } from "src/queries/useAuth";
import path from "src/constants/path";
import { LogOutIcon, TicketIcon, User2 } from "lucide-react";

const UserDropdown: React.FC = () => {
  const { t } = useTranslation("profile");
  const { profile, reset } = useContext(AppContext);
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    if (logoutMutation.isPending) return;

    try {
      await logoutMutation.mutateAsync();
      reset();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const getUserDisplayName = (): string => {
    if (profile?.name) return profile.name;
    return "METRO";
  };

  const getAvatarText = (): string => {
    const displayName = getUserDisplayName();
    return displayName.charAt(0).toUpperCase();
  };

  const dropdownItems = [
    {
      key: "profile-info",
      label: (
        <div className="px-2 py-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Avatar
              size={36}
              className="!bg-gradient-to-r from-red-500 to-blue-600 text-white !font-medium shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/30 group-hover:scale-110 transition-all duration-300"
            >
              {getAvatarText()}
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900">
                {getUserDisplayName()}
              </div>
              {profile?.email && (
                <div className="text-sm text-cyan-800 truncate max-w-[200px]">
                  {profile.email}
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider" as const,
    },
    {
      key: "profile",
      icon: <User2 size={18} />,
      label: t("userDropdown.profile"),
      onClick: () => navigate(path.profile),
    },
    {
      key: "my ticket",
      icon: <TicketIcon size={18} />,
      label: t("userDropdown.myTickets"),
      onClick: () => navigate(path.myTicket),
      className: "text-red-600 hover:text-red-700",
    },
    {
      key: "logout",
      icon: <LogOutIcon size={18} />,
      label: t("userDropdown.logout"),
      onClick: handleLogout,
      className: "text-red-600 hover:text-red-700",
    },
  ];

  return (
    <Dropdown
      menu={{
        items: dropdownItems,
      }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <div
        className="flex items-center gap-2 cursor-pointer p-2 transition-all duration-200 border border-transparent hover:bg-gradient-to-r hover:from-red-500/20 hover:to-blue-500/20 hover:border-blue-500/50
                   hover:border-2 hover:rounded-lg hover:shadow-lg hover:scale-105"
      >
        <Avatar
          size={36}
          className="!bg-gradient-to-r from-red-500 to-blue-600 text-white !font-medium shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/30 group-hover:scale-110 transition-all duration-300"
        >
          {getAvatarText()}
        </Avatar>
        <span className="text-white font-medium hidden sm:block max-w-[100px] truncate group-hover:text-white/90 transition-all duration-300">
          {getUserDisplayName()}
        </span>
      </div>
    </Dropdown>
  );
};

export default UserDropdown;
