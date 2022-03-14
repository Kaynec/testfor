<template>
  <div
    @touchstart="touchstart()"
    @touchend="touchend()"
    @mouseenter="mouseEnter()"
    @mouseleave="mouseLeave()"
    @click="click()"
    ref="Dialog"
    class="dialog"
  >
    <img v-if="active" src="../../assets/img/vpn-key-white.png" />
    <img v-else src="../../assets/img/vpn-key-red.png" />
    <span> {{ label }} </span>
    <i
      class="
        fas
        fa-angle-left
        position-absolute
        top-50
        start-0
        translate-middle
        ml-3
      "
    ></i>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import methods from '@/mixins/detectMobile';
import router from '@/router/index';
export default defineComponent({
  props: {
    label: { type: String },
    componentName: { type: String, default: 'empty' },
    params: { type: String }
  },

  setup(props) {
    let Dialog = ref();
    let active = ref(null);
    const isMobile = methods.methods.isMobile();

    const touchstart = () => {
      active.value = true;
      Dialog.value.classList.add('active');
    };

    const touchend = () => {
      active.value = false;
      Dialog.value.classList.remove('active');

      if (props.componentName != 'empty') {
        const tmp = {
          name: props.componentName
        };
        props.params &&
          (tmp.params = {
            id: props.params
          });
        router.push(tmp);
      }
    };

    const click = () => {
      if (!isMobile) {
        if (props.componentName != 'empty') {
          const tmp = {
            name: props.componentName
          };
          props.params &&
            (tmp.params = {
              id: props.params
            });
          router.push(tmp);
        }
      }
    };
    const getImgUrl = (src, color) => {
      return require('@/assets/img/Studentsetting/' + src + color + '.png');
    };

    const mouseEnter = () => {
      active.value = true;
      Dialog.value.classList.add('active');
      console.log('awdadawd');
    };

    const mouseLeave = () => {
      active.value = false;
      Dialog.value.classList.remove('active');
      console.log('awdadawd');
    };

    return {
      touchend,
      touchstart,
      getImgUrl,
      Dialog,
      active,
      click,
      mouseEnter,
      mouseLeave
    };
  }
});
</script>

<style lang="scss" scoped>
.dialog {
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.05);
  background-color: #fff;
  width: 95%;
  height: 47px;
  margin: 5px 0 5px 0;
  padding: 0.6rem;
  border-radius: 8px;
  color: black;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  gap: 0.5rem;

  span {
    font-family: IRANSans;
    font-size: 13px;
    font-weight: bold;
    line-height: 3.82;
    color: #171717;
  }

  .fa-angle-left {
    color: black !important;
  }
  .label {
    font-family: IRANSans;
    font-size: 12px;
    font-weight: 500;
  }
  .text-detail {
    font-family: IRANSans;
    font-size: 10px;
  }
  .card-icon {
    color: #c73f44d3;
    margin: 8px 0 4px 11.4px;
    font-size: 1.4rem;
  }
}
.active {
  &:before {
    content: '';
    position: absolute;
    padding: 0.6rem;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: #bd2b41;
    z-index: -2;
  }
  .fa-angle-left {
    color: white !important;
  }
  &:after {
    content: '';
    position: absolute;
    padding: 0.6rem;
    right: 0;
    width: 65%;
    height: 100%;
    border-radius: 8px;
    background: #9f2336;
    border-top-left-radius: 3em;
    z-index: -1;
  }
}
.active * {
  color: #fff !important;
}
</style>
