import Customer from '../models/customer.model.js';
import objectToDotNotation from '../libs/objectToDotNotation.js';
import planetRepository from './planet.repository.js';

class CustomerRepository {
    
  retrieve(retrieveOptions){//A
    if (retrieve.Options.planet) {
    const retrieveQuery = Customer.find({'planet' : retrieveOptions.planet}).sort({birthday : 'asc'}).limit(retrieveOptions.limit).skip(retrieveOptions.skip);
    }
    else{
    const retrieveQuery = Customer.find().sort({birthday : 'asc'}).limit(retrieveOptions.limit).skip(retrieveOptions.skip);
    }
        return Promise.all([retrieveQuery, Customer.countDocuments()]);
  }

  update(idCustomer, customerModifs) {// A

    const customerToDotNotation = objectToDotNotation(customerModifs);
    return Customer.findByIdAndUpdate(idCustomer, customerToDotNotation, {new:true});

}

transform(customer, transformOptions = {}) {
  if (transformOptions.planet)
  {
    customer.planet = planetRepository.transform(customer.planet);
  }

 // customer.lightspeed = `[${customer.planet}]@(${customer.coord.lat};${customer.coord.lon})`;
  customer.href = `${process.env.BASE_URL}/customers/${customer._id}`;

  delete customer._id;


  return customer;
}

}

export default new CustomerRepository();