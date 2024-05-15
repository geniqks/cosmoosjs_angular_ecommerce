import { NgModule } from "@angular/core";
import { RouterModule, type Routes } from "@angular/router";
import { UserComponent } from "./components/user/user.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: UserComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }
