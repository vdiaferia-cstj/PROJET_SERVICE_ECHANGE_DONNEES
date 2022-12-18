import Pizzeria from '../models/pizzeria.model.js';
import Order from '../models/order.model.js';
import OrdersRepository from '../repositories/orders.repositories.js'
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

  retrieveAll(retrieveOptions){ //B
    if(retrieveOptions.speciality){
      const retrieveQuery= Pizzeria.find({ "chef.speciality":retrieveOptions.speciality}).sort({name:'asc'}).limit(retrieveOptions.limit).skip(retrieveOptions.skip);
      return Promise.all([retrieveQuery,Pizzeria.countDocuments()]);
    }
    else{
      const retrieveQuery = Pizzeria.find().sort({name:'asc'}).limit(retrieveOptions.limit).skip(retrieveOptions.skip);
      return Promise.all([retrieveQuery, Pizzeria.countDocuments()]);
    }
  }

  transform(pizzeria, transformOptions) { 
    pizzeria.lightspeed = `[${pizzeria.planet}]@(${pizzeria.coord.lat};${pizzeria.coord.lon})`;
    pizzeria.href = `${process.env.BASE_URL}/pizzerias/${pizzeria._id}`;


    if (pizzeria.orders) {
      
    //  pizzeria.orders[0] = OrdersRepository.transform(pizzeria.orders[0]);
      pizzeria.orders = pizzeria.orders.map(o =>{
       o = OrdersRepository.transform(o);
       return o;
      });
    }
    
    delete pizzeria.id;
    delete pizzeria._id;

    return pizzeria;
  }
}

export default new PizzeriaRepository();