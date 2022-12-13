import express from 'express';
import database from './libs/database.js';
import errorMiddleware from './middlewares/errors.js';

import PizzeriaRoutes from './routes/pizzerias.routes.js'
import CustomerRoutes from './routes/customers.routes.js'
import OrdersRoutes from './routes/orders.routes.js' 

database();

const app = express();

app.use(express.json());

//app.use('/planets', planetsRoutes);
//app.use('/explorations', explorationsRoutes);
app.use('/pizzerias', PizzeriaRoutes);
app.use('/orders', OrdersRoutes );
app.use('/customers',CustomerRoutes );

app.use(errorMiddleware);

export default app;