import { instance } from '../../apiclient';
class CourseService {
  async get(id: string) {
    return instance.get(`course/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getAll(filter) {
    return instance.get(`course`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      },
      params: {
        filter
      }
    });
  }
  async getAllByField(fieldId) {
    return instance.get(`course/getByField/${fieldId}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getAllOrientationByField(fieldId) {
    return instance.get(`orientation/findByField/${fieldId}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async create(course: any) {
    return instance.post(`course`, course, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async update(id: string, course: any) {
    return instance.put(`course/${id}`, course, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async delete(id: string) {
    return instance.delete(`course/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const CourseServiceApi = new CourseService();
