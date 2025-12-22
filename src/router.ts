import { Router } from "express";


//Security
import { authRouter } from "./app/security";
import routerParameters from "./app/security/routes/Parameters.route";
import routerRoles from "./app/security/routes/Roles.route";
import routerUserRoles from "./app/security/routes/UserRoles.route";

//Clients
import routerCategories from "./app/clients/Categories.route";
import routerProducts from "./app/clients/Products.route";

//logistic
import routerCashMovements from "./app/logistics/CashMovements.route";
import routerInventoryMovements from "./app/logistics/InventoryMovements.route";

//Providers
import routerProviders from "./app/providers/Providers.route";
import routerPurchases from "./app/providers/Purchases.route";

//Sales
import routerSales from "./app/sales/Sales.route";



const router = Router();

//* Security
router.use('/auth', authRouter);
router.use('/parameters', routerParameters);
router.use('/roles', routerRoles);
router.use('/user-roles', routerUserRoles);

//* Clients
router.use('/categories', routerCategories);
router.use('/products', routerProducts);

//* Logistic
router.use('/cash-movements', routerCashMovements);
router.use('/inventory-movements', routerInventoryMovements);

//* Providers
router.use('/providers', routerProviders);
router.use('/purchases', routerPurchases);

//* Sales
router.use('/sales', routerSales);

export default router;