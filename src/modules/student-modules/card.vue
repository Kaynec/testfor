<template>
  <!-- Fix The Color of Before After Elements -->
  <div
    ref="Card"
    @touchstart="touchstart"
    @touchend="touchend"
    class="
      card
      w-100
      d-inline-flex
      align-items-center
      m-1
      position-relative
      flex-row flex-wrap
      border border-white
      rounded-10
      customDiv
    "
  >
    <img
      v-if="!active"
      :src="getImgUrl(iconSrc, '-red')"
      class="card-img"
      alt="exam Icon"
    />
    <img
      v-else-if="active"
      :src="getImgUrl(iconSrc, '-white')"
      class="card-img"
      alt="exam Icon"
    />

    <div
      class="d-flex flex-column mt-1 p-0 m-0"
      @touchstart="touchstart()"
      @touchend="touchend()"
      @click="isMobile() ? '' : touchend()"
    >
      <span class="label text-dark text-right mb-2"> {{ label }} </span>
      <span class="text-detail text-dark text-right">
        {{ TextDetail }}
      </span>
    </div>
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
import router from '@/router';

export default defineComponent({
  props: {
    iconSrc: { type: String },
    label: { type: String },
    TextDetail: { type: String },
    componentName: { type: String, default: 'empty' }
  },

  setup(props) {
    let Card = ref();
    let active = ref(null);

    const touchstart = () => {
      active.value = true;
      Card.value.classList.add('active');
    };

    const touchend = () => {
      active.value = false;
      Card.value.classList.remove('active');
      if (props.componentName != 'empty') {
        setTimeout(
          () =>
            router.push({
              name: props.componentName
            }),
          100
        );
      }
    };
    const getImgUrl = (src, color) => {
      return require('../../assets/img/Studentsetting/' + src + color + '.png');
    };
    return {
      touchend,
      touchstart,
      getImgUrl,
      Card,
      active
    };
  }
});
</script>

<style lang="scss" scoped>
$size: 45px;
.card {
  border-radius: 10px;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.05);
  background-color: #fff;

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
  .card-img {
    width: 29px;
    height: 29px;
    margin: 8px 0 4px 11.4px;
    object-fit: contain;
  }
  .card-icon {
    color: #c73f44d3;
    margin: 8px 0 4px 11.4px;
    font-size: 1.4rem;
  }
}
.customDiv {
  position: relative;
  z-index: 1;
  padding: 0.6rem;

  &:last-child {
    margin-bottom: 4rem !important;
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
    border-radius: 10px;
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
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background: #9f2336;
    border-top-left-radius: $size * 2000;
    // border-bottom-left-radius: 0.25em;
    z-index: -1;
  }
}
.active * {
  color: #fff !important;
}
</style>
