<template>
  <div class="panel">
    <h2>
      {{ model._id ? `ویرایش ${model.title}` : 'تعریف آزمون جدید' }}
    </h2>
    <form @submit.prevent="save" class="mt-5">
      <div class="form-row">
        <div class="form-group col-md-4 flex col-sm-12 center-block">
          <label for="title">عنوان :</label>
          <input
            type="text"
            class="form-control"
            id="title"
            v-model="model.title"
            @blur="v$.title.$touch()"
          />
          <span
            v-for="error in v$.title.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <!--  -->
        <div class="form-group col-md-2 col">
          <label>ساعت :</label>
          <select
            class="form-select"
            v-model="model.time"
            @blur="v$.time.$touch()"
          >
            <option value="00.00">00:00</option>
            <option value="00:30">00:30</option>
            <template v-for="number in 23" :key="number">
              <option
                :value="
                  number < 10
                    ? (number1 = `0${number}:00`)
                    : (number1 = `${number}:00`)
                "
              >
                {{ number1 }}
              </option>
              <option
                :value="
                  number < 10
                    ? (number2 = '0' + number + ':' + '30')
                    : (number2 = number + ':' + '30')
                "
              >
                {{ number2 }}
              </option>
            </template>
          </select>
          <!--  -->
          <span
            v-for="error in v$.time.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <!--  -->
        <div class="form-group col-md-2 col-sm-12">
          <label>تاریخ :</label>
          <input
            type="text"
            class="form-control"
            @blur="v$.date.$touch()"
            v-model="model.date"
            data-jdp
          />
          <span
            v-for="error in v$.date.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>

        <!--  -->
        <div class="form-group col-md-3 col-sm-12">
          <label>مدت زمان آزمون :</label>
          <input
            @blur="v$.duration.$touch()"
            type="number"
            class="form-control"
            v-model="model.duration"
          />
          <small> مدت زمان به دقیقه است </small>
          <span
            v-for="error in v$.duration.$errors"
            :key="error.id"
            class="form-text text-danger"
          >
            {{ error.$message }}
          </span>
        </div>
        <!--!!!!!!!!-->
      </div>

      <div class="form-row" v-if="!model._id">
        <div class="form-group col-md-2 col-sm-12">
          <div>
            <label> مقطع تحصیلی :</label>
            <select
              class="form-select"
              v-model="model.grade"
              @blur="v$.grade.$touch()"
            >
              <option
                v-for="grade in grades"
                :key="grade._id"
                :value="{ _id: grade._id }"
              >
                {{ grade.title }}
              </option>
            </select>
            <span
              v-for="error in v$.grade.$errors"
              :key="error.id"
              class="form-text text-danger"
            >
              {{ error.$message }}
            </span>
          </div>
        </div>

        <div class="form-group col-md-2 col-sm-12" v-if="!model._id">
          <div>
            <label> گروه تحصیلی :</label>
            <select
              class="form-select"
              v-model="model.group"
              @blur="v$.group.$touch()"
            >
              <option
                v-for="group in groups()?.groups"
                :value="{ _id: group._id }"
                :key="group._id"
              >
                {{ group.title }}
              </option>
            </select>
            <span
              v-for="error in v$.group.$errors"
              :key="error.id"
              class="form-text text-danger"
            >
              {{ error.$message }}
            </span>
          </div>
        </div>

        <div class="form-group col-md-2 col-sm-12" v-if="!model._id">
          <div>
            <label> فیلد تحصیلی :</label>
            <select
              class="form-select"
              v-model="model.field"
              @blur="v$.field.$touch()"
            >
              <option
                v-for="field in fields()"
                :key="field._id"
                :value="{ _id: field._id }"
              >
                {{ field.title }}
              </option>
            </select>
            <span
              v-for="error in v$.field.$errors"
              :key="error.id"
              class="form-text text-danger"
            >
              {{ error.$message }}
            </span>
          </div>
        </div>
      </div>
      <!--  -->
      <span class="span">سوالات آزمون</span>

      <div v-for="(item, firstIdx) in items" :key="item" class="custom-div">
        <!--  -->
        <div class="form-group col-md-4 col-sm-12">
          <!--  -->
          <div>
            <label> درس :</label>
            <select
              class="form-select"
              v-model="item.course"
              @blur="v$$.items.$touch()"
            >
              <option
                v-for="Course in cumputedCourses()"
                :value="{ _id: Course._id, title: Course.title }"
                :key="Course._id"
              >
                {{ Course.title }}
              </option>
            </select>
          </div>
          <!--  -->
          <button
            style="margin: 0.5rem"
            type="button"
            class="btn btn-secondary"
            @click="addSession(firstIdx)"
          >
            <i class="fas fa-plus-square fa-2x"></i>
          </button>
        </div>

        <div
          class="form-row custom-session-div"
          v-for="(session, index) in item.sessions"
          :key="session"
        >
          <div class="form-group col-md-4 col-sm-12">
            <label> فصل :</label>
            <select
              class="form-select"
              v-model="session.session"
              :key="session"
              @blur="v$$.items.$touch()"
            >
              <option
                v-for="Session in filteredSessions(item)"
                :key="Session._id"
                :value="{ _id: Session._id, title: Session.title }"
              >
                {{ Session.title }}
              </option>
            </select>
          </div>

          <div class="form-group col-md-4 col-sm-12">
            <label> تعداد سوالات این فصل :</label>

            <input
              style="display: block"
              @blur="v$$.items.$touch()"
              v-model="session.questionCount"
              type="number"
            />
          </div>
          <button
            type="button"
            class="btn btn-secondary"
            @click="deleteSession(firstIdx, index)"
          >
            <i class="fas fa-trash fa-2x"></i>
          </button>
        </div>
        <!--  -->
        <button
          type="button"
          class="btn btn-primary div"
          @click="deleteCourse(firstIdx)"
        >
          حذف کردن درس
        </button>
        <!--  -->
      </div>
      <span
        v-for="error in v$$.items.$errors"
        :key="error.id"
        class="form-text text-danger"
      >
        {{ error.$message }}
      </span>
      <!--  -->
      <div class="form-group col-md-4 col-sm-12">
        <button
          class="btn btn-primary ml-3 mt-4"
          type="button"
          @click="addCourse()"
        >
          اضافه کردن درس
        </button>
      </div>
      <button class="btn btn-secondary ml-3 mt-4" @click="cancel()">
        برگشت
      </button>
      <button type="submit" class="btn btn-primary mt-4">ذخیره</button>
    </form>
  </div>
</template>

<script lang="ts">
import { reactive, defineComponent, computed, ref, watch } from 'vue';
import router from '@/router';
import useVuelidate from '@vuelidate/core';
import {
  helpers,
  minLength,
  required,
  minValue,
  numeric
} from '@vuelidate/validators';
import { CourseServiceApi } from '@/api/services/admin/course-service';
import { SessionServiceApi } from '@/api/services/admin/session-service';
import '@majidh1/jalalidatepicker/dist/jalaliDatepicker.css';
import '@majidh1/jalalidatepicker/dist/jalaliDatepicker.js';
import { ExamServiceApi } from '@/api/services/admin/exam-service';
import { GradeServiceApi } from '@/api/services/admin/grade-service';
const alertify = require('@/assets/alertifyjs/alertify');
export default defineComponent({
  props: {
    exam: {
      type: String,
      default: '{}'
    }
  },
  setup(props) {
    let model = reactive(JSON.parse(props.exam));
    let Courses = ref<any>([]);
    let Sessions = ref<any>([]);
    let items = ref<any>([]);
    let grades = ref([]);

    const groups = () => {
      return grades.value.find((el: any) => {
        return el._id === model.grade._id;
      }) as any;
    };

    const fields = () => {
      if (groups() && groups().groups) {
        return groups().groups.find((el) => {
          console.log(el._id, model.group._id);
          return el._id === model.group._id;
        })?.fields;
      }
    };

    const cumputedCourses = () => {
      // means we have a filed and we can't set a new filed (update)

      if (typeof model.field === 'string') {
        return Courses.value.filter((el) => {
          return el.field === model.field;
        });
      } else {
        return Courses.value.filter((el) => {
          return el.field === model.field._id || el.field === model.field;
        });
      }
    };

    // getting a list of all courses and sessions from the database

    CourseServiceApi.getAll({}).then((res) => {
      res.data.data.forEach((el: any) => {
        Courses.value.push(el);
      });
    });
    SessionServiceApi.getAll({}).then((res) => {
      res.data.data.forEach((el: any) => {
        Sessions.value.push(el);
      });
    });

    GradeServiceApi.getAll().then((res) => {
      grades.value = res.data.data;
    });

    // for each item make a course and if the course exists push a session into it
    if (JSON.stringify(model) != '{}') {
      model.budgeting.forEach((item: any) => {
        const duplicate = items.value.find(
          (el: any) => el.course._id == item.course
        );
        // if an item with that id does not exist on the items array create one
        if (!duplicate)
          items.value.push({
            sessions: [],
            course: { _id: item.course }
          });
      });
      // push the sessions into it's appropiate place
      items.value.forEach((itemel: any) => {
        CourseServiceApi.get(itemel.course._id).then((res) => {
          itemel.course = {
            title: res.data.data.title,
            _id: res.data.data._id
          };
        });

        model.budgeting.forEach((item: any) => {
          if (itemel.course._id == item.course) {
            //
            SessionServiceApi.get(item.session).then((res) => {
              itemel.sessions.push({
                questionCount: item.questionCount,
                session: { _id: item.session, title: res.data.data.title }
              });
            });
            //
          }
        });
      });
    }
    // initializing date picker
    (window as any).jalaliDatepicker.startWatch();
    //
    model =
      JSON.stringify(model) === '{}'
        ? reactive({
            title: '',
            date: '',
            time: '',
            duration: 10,
            grade: '',
            group: '',
            field: ''
          })
        : model;
    // The filteredSessions => sessions only for that course
    let filteredSessions = (item: any) => {
      return Sessions.value.filter((el: any) => {
        return el.course == item.course._id;
      });
    };
    //
    const addCourse = () =>
      items.value.push({
        questionCount: 1,
        sessions: [],
        course: {}
      });

    const deleteCourse = (idx: number) => {
      items.value.splice(idx, 1);
    };

    const addSession = (index: number) => {
      items.value[index].sessions.push({
        session: {},
        questionCount: 1
      });
    };

    const deleteSession = (courseIdx: number, index: number) =>
      items.value[courseIdx].sessions.splice(index, 1);
    //
    const save = () => {
      /// error handeling
      v$.value.$touch();
      v$$.value.$touch();
      let budgeting: any = [];
      items.value.forEach((item: any) => {
        item.sessions.forEach((ses: any) => {
          budgeting.push({
            questionCount: ses.questionCount,
            course: { _id: item.course._id },
            session: { _id: ses.session._id }
          });
        });
      });
      //
      if (!v$.value.$invalid && !v$$.value.$invalid) {
        let tmp: any = {
          title: model.title,
          date: model.date,
          time: model.time,
          duration: model.duration,
          budgeting: budgeting,
          grade: model.grade,
          group: model.group,
          field: model.field
        };
        if (model._id) {
          // if there is a id , means that it's coming from DB and it's a string
          tmp.grade = { _id: tmp.grade };
          tmp.group = { _id: tmp.group };
          tmp.field = { _id: tmp.field };
          ExamServiceApi.update(model._id, tmp).then((result) => {
            alertify.success(result.data.message);
            router.push({
              name: 'exam'
            });
          });
        } else {
          ExamServiceApi.create(tmp).then((result) => {
            alertify.success(result.data.message);
            router.push({
              name: 'exam'
            });
          });
        }
      }
    };
    // Validations
    const unique = (group: any): any => {
      return () => {
        let boolean = true;
        group.forEach((item: any, index: number) => {
          const copyOfCourse = group.find((course: any, idx: number) => {
            return course.course._id == item.course._id && index != idx;
          });
          if (copyOfCourse) boolean = false;
        });
        return boolean;
      };
    };
    //
    const innerUnique = (group: any): any => {
      return () => {
        let boolean = true;
        group.forEach((item: any) => {
          item.sessions.forEach((ses: any, idx: number) => {
            const copyOfSession = item.sessions.find(
              (session: any, i: number) => {
                return session.session._id == ses.session._id && idx != i;
              }
            );
            if (copyOfSession) boolean = false;
          });
        });
        return boolean;
      };
    };
    //
    const rules = computed(() => {
      if (model._id) {
        return {
          title: {
            required: helpers.withMessage('عنوان آزمون ضروری است', required),
            minLength: helpers.withMessage(
              'عنوان باید بیشتر از 3حرف باشد',
              minLength(3)
            )
          },
          time: {
            required: helpers.withMessage(
              'لطفا  ساعت آزمون را مشخص کنید',
              required
            )
          },

          date: {
            required: helpers.withMessage(
              'لطفا تاریخ آزمون را مشخص کنید',
              required
            )
          },

          duration: {
            required: helpers.withMessage(
              'لطفا مدت زمان آزمون را مشخص کنید',
              required
            ),
            numeric,
            minValue: helpers.withMessage(
              'زمان آزمون باید حداقل ده دقیقه باشد',
              minValue(10)
            )
          }
        };
      } else {
        return {
          title: {
            required: helpers.withMessage('عنوان آزمون ضروری است', required),
            minLength: helpers.withMessage(
              'عنوان باید بیشتر از 3حرف باشد',
              minLength(3)
            )
          },
          time: {
            required: helpers.withMessage(
              'لطفا  ساعت آزمون را مشخص کنید',
              required
            )
          },

          date: {
            required: helpers.withMessage(
              'لطفا تاریخ آزمون را مشخص کنید',
              required
            )
          },
          duration: {
            required: helpers.withMessage(
              'لطفا مدت زمان آزمون را مشخص کنید',
              required
            ),
            numeric,
            minValue: helpers.withMessage(
              'زمان آزمون باید حداقل ده دقیقه باشد',
              minValue(10)
            )
          },
          grade: {
            required: helpers.withMessage(
              'لطفا مقطح تحصیلی آزمون را مشخص کنید',
              required
            )
          },

          group: {
            required: helpers.withMessage(
              'لطفا گروه تحصیلی آزمون را مشخص کنید',
              required
            )
          },

          field: {
            required: helpers.withMessage(
              'لطفا فیلد تحصیلی آزمون را مشخص کنید',
              required
            )
          }
        };
      }
    }) as any;
    const itemRules = computed(() => ({
      items: {
        unique: helpers.withMessage(
          'لطفا درس های  تکراری را حذف کنید',
          unique(items.value)
        ),
        innerUnique: helpers.withMessage(
          'لطفا فصل های تکراری را حذف کنید',
          innerUnique(items.value)
        )
      }
    }));

    const tempItems: any = { items };
    const v$ = useVuelidate(rules, model);
    const v$$ = useVuelidate(itemRules, tempItems);
    // cancel //
    const cancel = () => {
      router.push({
        name: 'exam'
      });
      alertify.notify('cancelled action');
    };
    //
    watch(items.value, () => console.log(items.value));
    //
    return {
      model,
      save,
      cancel,
      v$,
      v$$,
      Courses,
      addCourse,
      deleteCourse,
      filteredSessions,
      items,
      addSession,
      deleteSession,
      grades,
      fields,
      groups,
      cumputedCourses
    };
  }
});
</script>

<style lang="scss" scoped>
.span {
  display: inline-block;
  margin: 1.5rem 0.75rem 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  border-bottom: 10px #ddd solid;
}
.div {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
  transform: translateY(10%);
}
small {
  color: rgb(151, 144, 144);
}
.custom-session-div {
  display: flex;
  align-items: center;
  border: 1px solid rgb(202, 192, 192);
  margin: 0.5rem;
  padding: 0.5rem;
  border-radius: 10px;
}
.custom-div {
  background-color: rgb(245, 245, 245);
  margin: 1rem 0 1rem 0;
  padding: 1rem;
  border-radius: 10px;
}
</style>
