import { NgModule } from "@angular/core";
import { RouterModule, type Routes } from "@angular/router";
import { canActivateAuth } from "./auth/guards/auth.guard";

const routes: Routes = [
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule)
  },
  {
    path: '',
    canActivate: [canActivateAuth],
    children: [
      {
        path: "user",
        loadChildren: () => import("./user/user.module").then((m) => m.UserModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
