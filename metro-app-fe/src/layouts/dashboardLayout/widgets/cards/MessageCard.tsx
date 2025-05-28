import { Avatar, Typography } from "@material-tailwind/react";
import { ReactNode } from "react";

interface MessageCardProps {
  img: string;
  name: string;
  message: ReactNode;
  action?: ReactNode;
}

export function MessageCard({
  img,
  name,
  message,
  action = null,
}: MessageCardProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Avatar
          src={img}
          alt={name}
          variant="rounded"
          className="shadow-lg shadow-blue-gray-500/25"
        />
        <div>
          <Typography
            variant="small"
            color="blue-gray"
            className="mb-1 font-semibold"
          >
            {name}
          </Typography>
          <Typography className="text-xs font-normal text-blue-gray-400">
            {message}
          </Typography>
        </div>
      </div>
      {action}
    </div>
  );
}

export default MessageCard;
