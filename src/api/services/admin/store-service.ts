import { instance } from '../../apiclient';

class StoreService {
  async get(id: string) {
    return instance.get(`product/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getAllCategories() {
    return instance.get(`product-category`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getAll() {
    return instance.get(`product`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async create(user: any) {
    return instance.post(`product`, user, {
      headers: {
        // 'Content-Type': 'multipart/form-data'
      }
    });
  }
  async update(id: number, user: any) {
    return instance.put(`product/${id}`, user, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async delete(id: string) {
    return instance.delete(`product/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async CreateCategorie(category) {
    return instance.post(`product-category`, category, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async UpdateCategorie(id: string, category) {
    return instance.put(`product-category/${id}`, category, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async deleteCategory(id: string) {
    return instance.delete(`product-category/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const StoreServiceApi = new StoreService();
