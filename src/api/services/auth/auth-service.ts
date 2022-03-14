import { instance } from '../../apiclient';
import { LoginDocuments } from '@/@types';
class AuthService {
  async login(user: LoginDocuments) {
    return instance.post('auth/admin/login', user, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async currentUser() {
    return instance.get('auth/admin/me', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  logout() {
    console.log('logout');
  }
}

export const AuthServiceApi = new AuthService();
