import db from "@/libs/db";
import getSession from "@/libs/session";

async function getNotifications() {
  const session = await getSession();
  const notifications = await db.notifications.findMany({
    where: {
      userId: session.id,
    },
  });

  return notifications;
}

export default async function Notification() {
  const notifications = await getNotifications();
  console.log(notifications);

  return (
    <div>
      <div></div>
    </div>
  );
}
