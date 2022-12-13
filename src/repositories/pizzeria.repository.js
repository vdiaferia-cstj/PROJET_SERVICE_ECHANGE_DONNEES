import Pizzeria from '../models/pizzeria.model.js';
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

  transform(pizzeria, transformOptions = {}) {
    pizzeria.lightspeed = `[${pizzeria.planet}]@(${pizzeria.coord.lat};${pizzeria.coord.lon})`;
    pizzeria.href = `${process.env.BASE_URL}/pizzerias/${pizzeria._id}`;

    delete pizzeria._id;

    return pizzeria;
  }
}

export default new PizzeriaRepository();