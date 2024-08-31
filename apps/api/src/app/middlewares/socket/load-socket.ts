import { IocContainer } from "@cosmoosjs/core";
import { SocketProvider } from "@libs/providers/sockets";

// Where all application events are loaded
const eventsLoader = [
  import('@libs/user/user.event'),
]

/** Load application event into the socket provider */
export async function loadSocketsEvents() {
  for (const events of eventsLoader) {
    const loadedEvent = await events;
    if (Array.isArray(loadedEvent.default)) {
      for (const event of loadedEvent.default) {
        const socketProvider = IocContainer.container.get(SocketProvider);
        //@ts-ignore TODO: fix ça
        socketProvider.addEvent(event);
      }
    }
  }
}