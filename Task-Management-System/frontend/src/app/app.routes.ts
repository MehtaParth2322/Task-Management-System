import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { authGuard, loggedinGuard } from './guards/auth.guard';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
    { path: "", component: LoginComponent, title: "TMS by Parth", canActivate: [loggedinGuard] },
    { path: "home", component: HomeComponent, title: "TMS by Parth" },
    { path: "profile", component: ProfileComponent, title: "TMS by Parth", canActivate: [authGuard] },
    { path: "addTask", component: AddTaskComponent, title: "TMS by Parth", canActivate: [authGuard] },
    { path: "taskList", component: TaskListComponent, title: "TMS by Parth", canActivate: [authGuard] },
    { path: "login", component: LoginComponent, title: "TMS by Parth", canActivate: [loggedinGuard] },
    { path: "register", component: RegisterComponent, title: "TMS by Parth", canActivate: [loggedinGuard] },
    { path: "**", component: NotfoundComponent, title: "404 Not found"},
    { path: 'addTask/:taskId', component: AddTaskComponent, title: "TMS by Parth", canActivate: [authGuard] },
];
