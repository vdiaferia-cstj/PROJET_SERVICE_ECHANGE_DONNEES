import Pizzeria from '../models/pizzeria.model.js';
import Order from '../models/order.model.js';
class PizzeriaRepository {

  retrieveById(idPizzeria, retrieveOptions) {
    const retrieveQuery = Pizzeria.findById(idPizzeria);
    if (retrieveOptions.orders) {
      retrieveQuery.populate('orders');
    }
    return retrieveQuery;
  }

  create(pizzeria) {
    return Pizzeria.create(pizzeria);
  }

  retrieveAll(){
    return Pizzeria.find();
  }

}

export default new PizzeriaRepository();