import { IocContainer } from "@cosmoosjs/core";
import type { SocketEvent } from "@libs/providers/sockets";
import type { ISocketReceivedMessage } from "@packages/types";
import { UserRepository } from "./user.repository";

export default [
  {
    event: 'user_exist',
    /**
     * @param event Should be the username
     */
    callback: async (event): Promise<ISocketReceivedMessage> => {
      const userRepository = IocContainer.container.get(UserRepository);
      const isExist = await userRepository.isExist(event.data.value.toString());

      return {
        value: isExist,
        control: event.data.control,
        source: 'user_exist',
      };
    }
  } as SocketEvent<ISocketReceivedMessage>,
] satisfies SocketEvent<ISocketReceivedMessage>[];