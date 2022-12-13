import Customer from '../models/customer.model.js';
class CustomerRepository {
    
  retrieve(retrieveOptions){
    //TODO : Retourner seulement situé sur la planète possédant le nom fourni
    const retrieveQuery = Customer.find().limit(retrieveOptions.limit).skip(retrieveOptions.skip);
        return Promise.all([retrieveQuery, Customer.countDocuments()]);
  }

  create(customer){ // B
    return Customer.create(customer);
  }


}

export default new CustomerRepository();