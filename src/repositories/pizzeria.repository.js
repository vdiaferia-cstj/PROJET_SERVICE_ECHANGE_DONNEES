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
      const retrieveQuery= Pizzeria.find({ "chef.speciality":retrieveOptions.speciality}).sort({'chef.name':'desc'}).limit(retrieveOptions.limit).skip(retrieveOptions.skip);
      return Promise.all([retrieveQuery,Pizzeria.countDocuments(Pizzeria.find({ "chef.speciality":retrieveOptions.speciality}))]);
    }
    else{
      const retrieveQuery = Pizzeria.find().limit(retrieveOptions.limit).sort({'chef.name':'desc'}).skip(retrieveOptions.skip);
      return Promise.all([retrieveQuery, Pizzeria.countDocuments()]);
    }
  }

  retrieveOne(idOrder, idPizzeria, retrieveOptions) { //B 
    const retrieveQuery = Order.find({'_id':idOrder, 'pizzeria':idPizzeria})

    
    if(retrieveOptions.customers){
        retrieveQuery.populate('customers');
        
    }

    return retrieveQuery;
}

  transform(pizzeria, transformOptions) { 

    //if (transformOptions.body === 'false') {
      pizzeria.href = `${process.env.BASE_URL}/pizzerias/${pizzeria._id}`;
   // }

   
    pizzeria.href = `${process.env.BASE_URL}/pizzerias/${pizzeria._id}`;
    pizzeria.lightspeed = `[${pizzeria.planet}]@(${pizzeria.coord.lat};${pizzeria.coord.lon})`;
    pizzeria.href = `${process.env.BASE_URL}/pizzerias/${pizzeria._id}`;

    if (pizzeria.orders) {   
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