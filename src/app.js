import express from 'express';
import database from './libs/database.js';
import errorMiddleware from './middlewares/errors.js';

import planetsRoutes from './routes/planets.routes.js';
import PizzeriaRoutes from './routes/pizzerias.routes.js'
import CustomerRoutes from './routes/customers.routes.js'
import OrdersRoutes from './routes/orders.routes.js' 

database();

const app = express();

app.use(express.json());

//app.use('/planets', planetsRoutes);
//app.use('/explorations', explorationsRoutes);
app.use('/pizzeria', PizzeriaRoutes);
app.use('/orders', CustomerRoutes);
app.use('/customer', OrdersRoutes);

app.use(errorMiddleware);

export default app;