import express from 'express';
import HttpError from 'http-errors';

import Order from '../models/order.model.js';
import Customer from '../models/customer.model.js';
import pizzeriaRepository from './pizzeria.repository';
class ExplorationRepository{
    
    retrieveByIdOrder(idOrder,idPizzeria, retrieveOptions){ //B
        const retrieveQuery = Customer.find(idPizzeria,idOrder)
    }
}