import Pizzeria from '../models/pizzeria.model.js';
import Order from '../models/order.model.js';
class PizzeriaRepository {
    
  retrieveById(idPizzeria,retrieveOption){
    const retrieveQuery = Pizzeria.findById(idPizzeria);
    if (retrieveOption.orders) {
        retrieveQuery.populate('orders');
    }
    return retrieveQuery;
  }

}

export default new PizzeriaRepository();