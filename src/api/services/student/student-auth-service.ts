import { studentInstance as instance } from './student-api-client';
import { LoginDocuments, UserDocuments } from '@/@types';
class StudentAuthService {
  async signUp(user: UserDocuments) {
    return instance.post('auth/student/signup', user, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async login(user: LoginDocuments) {
    return instance.post('auth/student/login', user, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async loginOnce(user) {
    return instance.post('auth/student/login-once', user, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async sendVerificationCode(code) {
    return instance.post('auth/verificationcode', code, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async resendVerificationCode(phone) {
    return instance.post('auth/sendverificationcode', phone, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async editStudent(student) {
    return instance.post('auth/student/profile', student, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async currentUser() {
    return instance.get('auth/student/me', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getStudentImage(name: string) {
    return instance.get(`student/getProfileImage/${name}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
      }
    });
  }
  async uploadProfile(formDataPicture) {
    return instance.post('student/uploadProfile', formDataPicture, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'multipart/form-data'
      }
    });
  }
  logout() {
    console.log('logout');
  }
  async getAllStates() {
    return instance.get('auth/states', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'multipart/form-data'
      }
    });
  }
  async messages() {
    return instance.get('notification', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async announcements() {
    return instance.get('announcement', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async updateNote(note) {
    return instance.post('student/updateNote', note, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async getStudentPoints() {
    return instance.get('user-points/get-for-student', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const StudentAuthServiceApi = new StudentAuthService();
