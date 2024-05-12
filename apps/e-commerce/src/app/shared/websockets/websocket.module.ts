import { NgModule } from "@angular/core";
import { WebsocketService } from "./services/websocket.service";

const exported = [
  WebsocketService
]

@NgModule({
  providers: [
    ...exported
  ]
})
export class WebsocketModule { }
