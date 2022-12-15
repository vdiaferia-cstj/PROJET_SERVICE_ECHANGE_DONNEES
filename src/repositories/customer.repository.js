import Customer from '../models/customer.model.js';
import Order from '../models/order.model.js';

import objectToDotNotation from '../libs/objectToDotNotation.js';
import dayjs from 'dayjs';
import Order from '../models/order.model.js';

class CustomerRepository {

  retrieveById(idCustomer, retrieveOptions) {
    const retrieveQuery = Customer.findById(idCustomer);

    if (retrieveOptions.orders){
      retrieveQuery.populate('orders');
    }

    return retrieveQuery;
  }

  retrieve(retrieveOptions) {//A
    if (retrieveOptions.planet) {
      const retrieveQuery = Customer.find({ 'planet': retrieveOptions.planet }).sort({ birthday: 'asc' }).limit(retrieveOptions.limit).skip(retrieveOptions.skip);
    }
    else {
      const retrieveQuery = Customer.find().sort({ birthday: 'asc' }).limit(retrieveOptions.limit).skip(retrieveOptions.skip);
    }
    return Promise.all([retrieveQuery, Customer.countDocuments()]);
  }

  update(idCustomer, customerModifs) {// A

    const customerToDotNotation = objectToDotNotation(customerModifs);
    return Customer.findByIdAndUpdate(idCustomer, customerToDotNotation, { new: true });

  }

  transform(customer, transformOptions = {}) {
    if (transformOptions.planet) {
      customer.planet = planetRepository.transform(customer.planet);
    }

    customer.href = `${process.env.BASE_URL}/customers/${customer._id}`;
    customer.phone = `[${customer.phone.slice(0, 4)}]${customer.phone.slice(4, 8)}-${customer.phone.slice(8, 14)}@${customer.phone.slice(14, 16)}`;
    customer.age = `${dayjs().diff(customer.birthday, 'years')}`;
    customer.lightspeed = `[${customer.planet}]@(${customer.coord.lat};${customer.coord.lon})`;

    delete customer._id;
    delete customer.id;



    return customer;
  }

  create(customer){ // B
    return Customer.create(customer);
  }


}

export default new CustomerRepository();