import db from "@/libs/db";
import getSession from "@/libs/session";
import { notFound, redirect } from "next/navigation";
import SendRequestForm from "@/components/domains/friendship/send-form";

async function getRecipient(loginId: string) {
  const recipient = await db.user.findUnique({
    where: {
      loginId: loginId,
    },
    select: {
      id: true,
      username: true,
    },
  });

  return recipient;
}

async function getIsFriend(userId: number, recipientId: number) {
  const isFriend = await db.friendship.findFirst({
    where: {
      OR: [
        { initiatorId: userId, recipientId: recipientId },
        { initiatorId: recipientId, recipientId: userId },
      ],
      status: { in: [1, 2] },
    },
  });

  return isFriend;
}

export default async function SendRequest({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: loginId } = await params;
  const recipient = await getRecipient(loginId);
  if (!recipient) {
    return notFound();
  }

  const session = await getSession();
  if (!session.id) {
    return redirect("/login");
  }

  const isFriend = await getIsFriend(session.id, recipient.id);
  if (isFriend) {
    return redirect("/me");
  }

  return <SendRequestForm username={recipient.username} loginId={loginId} />;
}
