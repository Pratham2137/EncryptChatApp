import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../features/store";
import { getSocket } from "../../utils/socket";
import { receiveMessage } from "../../features/chat/chatSlice";

export default function SocketListener() {
  const me = useSelector((s:RootState) => s.userProfile.data);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!me) return;
    const socket = getSocket();

    socket.on("receive-message", (msg: {
        sender: string;
        ciphertext: string;
        createdAt: string;
      }) => {
      dispatch(
        receiveMessage({
          sender:    msg.sender,
          text:      msg.ciphertext,
          createdAt: msg.createdAt,
        })
      );
    });

    return () => {
      socket.off("receive-message");
    };
  }, [me, dispatch]);

  return null;
}
