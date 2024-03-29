import express from 'express';
import HttpError from 'http-errors';

import Order from '../models/order.model.js';
import Customer from '../models/customer.model.js';
import pizzeriaRepository from './pizzeria.repository.js';
class OrdersRepositories {

    retrieve(retrieveOptions) {
        let retrieveQuery = Order.find();
        let countQuery = Order.countDocuments();

        if (retrieveOptions.toppings) {
            const filter = { 'pizzas.toppings': retrieveOptions.toppings };
            retrieveQuery = Order.find(filter);
            countQuery = Order.countDocuments(filter);
        }

        retrieveQuery.limit(retrieveOptions.limit).skip(retrieveOptions.skip).sort({ orderDate: 'desc' });
        return Promise.all([retrieveQuery, countQuery]);
    }

    

    transform(order, retrieveOptions) {

        order.customer = { href: `${process.env.BASE_URL}/customers/${order.customer._id}` };
        order.pizzeria = { href: `${process.env.BASE_URL}/pizzerias/${order.pizzeria._id}` };
        order.href = order.pizzeria.href + "/orders/" + order._id;

        let price = 0;
        order.pizzas.forEach(p => {
            price += parseFloat(p.price);
            order.subTotal = price;
        });

        order.taxRates = 0.0087;
        order.taxes = parseFloat((order.subTotal * order.taxRates).toFixed(3));
        order.total = order.taxes + order.subTotal;

        order.pizzas.forEach(p => {
            delete p.id;
            delete p._id;
        });

        delete order.id;
        delete order._id;
        return order;
    }
}

export default new OrdersRepositories();