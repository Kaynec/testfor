<template>
  <div class="card">
    <img class="lesson-img" :src="getImgUrl(imgSrc)" alt="lesson img" />
    <h5>{{ label }}</h5>
    <!-- Fix This Later With Real Data  -->
    <div class="BG" :class="{ active: count > 0 }">
      {{ count }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    label: { type: String },
    imgSrc: { type: String },
    count: { type: String, default: '0' }
  },
  setup() {
    const getImgUrl = (src: string) => {
      return require('../../../assets/img/azmoon-icons/' + src + '.png');
    };
    return { getImgUrl };
  }
});
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  border-radius: 14.7px;
  box-shadow: -2px 2px 3px 0 rgba(0, 0, 0, 0.08);
  background-color: #fff;
  flex-shrink: 0;
  width: 30%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1rem 0 1rem 0;
  .BG {
    position: absolute;
    top: -5px;
    left: -5px;
    width: 25px;
    height: 25px;
    border-radius: 12.5px;
    background-color: #d3d7e0;
    color: #fff;
    font-family: IRANSans;
    font-size: 12px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .BG.active {
    background-color: #d21921;
  }
  h5 {
    margin: 17px 0 0;
    font-family: IRANSans;
    font-size: 14.7px;
    line-height: 1.25;
    color: #646464;
  }
}
</style>
