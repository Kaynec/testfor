import { MentorInstance as instance } from './mentor-api-client';

class Chat {
  async getMentorAllChatBystudentId(studentId) {
    return instance.get(`chat/mentor/${studentId}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async seeStudentMessage(student) {
    return instance.post('chat/mentor/seen', student, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const MentorChatApi = new Chat();
