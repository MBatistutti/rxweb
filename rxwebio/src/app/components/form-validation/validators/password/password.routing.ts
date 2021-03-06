import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageComponent } from "src/app/components/form-validation/page/page.component";
const PASSWORD_ROUTES: Routes = [
{
	path:':typeName',
	component:PageComponent
}
];
export const PASSWORD_ROUTING: ModuleWithProviders = RouterModule.forChild(PASSWORD_ROUTES);