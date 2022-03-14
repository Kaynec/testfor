import { studentInstance as instance } from './student-api-client';
class Basket {
  async get() {
    return instance.get('shopping-cart/get', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async add(product: any) {
    return instance.post('shopping-cart', product, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        // 'Content-Type': 'application/json'
      }
    });
  }
  async finalizeOrder() {
    return instance.post('order', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async HistoryOfBoughtProducts() {
    return instance.get('order/get', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const StudentBasketApi = new Basket();
