import Notification from "../models/Notification";

interface Props {
  user: string;

  title: string;

  message: string;

  type: string;
}

const createNotification =
  async ({
    user,
    title,
    message,
    type,
  }: Props) => {

    await Notification.create({
      user,
      title,
      message,
      type,
    });
  };

export default createNotification;