import { studentInstance as instance } from './student-api-client';
class product {
  async getCategory(id: string) {
    return instance.get(`product-category/${id}`, {
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
  async getNewProducts() {
    return instance.get('product/getnewproducts', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getBoughtProducts() {
    return instance.get('order/getBoughtProducts', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getProduct(id: string) {
    return instance.get(`product/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getAllProducts(id) {
    return instance.get(`/product/getbycategory/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  getDemoFile(id: string) {
    return instance.get(`/product/demo/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        // 'Content-Type': 'application/json'
      }
    });
  }
  getOriginalFile(id: string) {
    return instance.get(`/product/original/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        // 'Content-Type': 'application/json'
      }
    });
  }
}

export const StudentproductApi = new product();
