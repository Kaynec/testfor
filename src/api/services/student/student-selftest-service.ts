import { studentInstance as instance } from '@/api/services/student/student-api-client';
class SelfTest {
  async AllCourses() {
    return instance.get('course/getCourses', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getImage(id: string) {
    return instance.get(`course/image/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async registerSelfTest(selftest) {
    return instance.post('self-test', selftest, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getOneSession(id: string) {
    return instance.get(`session/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getOneCourse(id: string) {
    return instance.get(`course/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async selfTestResult(selftest) {
    return instance.post('self-test/getSessionResult', selftest, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async bookmarkQuestion(question) {
    return instance.post('selected-question', question, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async unBookmarkQuestion(id) {
    return instance.delete(`selected-question/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async AllBookmarkQuestions() {
    return instance.get('selected-question/', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const StudentSelfTestApi = new SelfTest();
