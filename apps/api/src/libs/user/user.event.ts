import { IocContainer } from "@cosmoosjs/core";
import type { SocketEvent } from "@libs/providers/sockets";
import { UserRepository } from "./user.repository";

export default [
  {
    event: 'user_exist',
    /**
     * @param event Should be the username
     */
    callback: async (event) => {
      if (typeof event.data === 'string') {
        const userRepository = IocContainer.container.get(UserRepository);
        const isExist = await userRepository.isExist(event.data);
        return isExist;
      }
    }
  }
] satisfies SocketEvent[];