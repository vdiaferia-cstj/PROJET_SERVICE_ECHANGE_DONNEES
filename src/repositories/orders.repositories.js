import express from 'express';
import HttpError from 'http-errors';

import Order from '../models/order.model.js';
import Customer from '../models/customer.model.js';
import pizzeriaRepository from './pizzeria.repository.js';
class OrdersRepositories {

    retrieve(retrieveOptions) {
        if (retrieveOptions.topping) {
            const retrieveQuery = Order.find({ "pizzas.toppings": retrieveOptions.topping }).sort({ orderDate: 'desc' }).limit(retrieveOptions.limit).skip(retrieveOptions.skip);
            return Promise.all([retrieveQuery, Order.countDocuments()]);

        } else {
            const retrieveQuery = Order.find().sort({ orderDate: 'desc' }).limit(retrieveOptions.limit).skip(retrieveOptions.skip);
            return Promise.all([retrieveQuery, Order.countDocuments()]);
        }

        //return Promise.all([retrieveQuery, Order.countDocuments()]);
    }

    retrieveByIdOrder(idOrder, idPizzeria, retrieveOptions) { //B
        const retrieveQuery = Customer.find(idPizzeria, idOrder)
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
        console.log(price);
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