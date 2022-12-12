import Customer from '../models/customer.model.js';
import objectToDotNotation from '../libs/objectToDotNotation.js';

class CustomerRepository {
    
  retrieve(retrieveOptions){
    
    const retrieveQuery = Customer.find({'planet' : retrieveOptions.planet}).sort({birthday : 'asc'}).limit(retrieveOptions.limit).skip(retrieveOptions.skip);
        return Promise.all([retrieveQuery, Customer.countDocuments()]);
  }

  update(idCustomer, customerModifs) {

    const customerToDotNotation = objectToDotNotation(customerModifs);
    return Customer.findByIdAndUpdate(idCustomer, customerToDotNotation, {new:true});

}

}

export default new CustomerRepository();