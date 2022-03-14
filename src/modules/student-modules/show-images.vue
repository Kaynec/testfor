<template>
  <div class="image animate__animated animate__fadeIn">
    <div class="flex-child" style="overflow: hidden">
      <div class="img-container">
        <i class="fas fa-2x fa-angle-right" @click="moveImg(1)"></i>
        <figure class="img">
          <img
            :src="imgUrls[currentImgIdx]"
            alt="image of component given data"
          />
          <figcaption>
            تصویر {{ toPersianNumbers(currentImgIdx + 1) }} از
            {{ toPersianNumbers(imgUrls.length) }}
          </figcaption>
        </figure>
        <i class="fas fa-2x fa-angle-left" @click="moveImg(-1)"></i>
      </div>
      <!-- Img Icon -->
      <img
        src="@/assets/img/icons-raw-close.png"
        class="x-icon"
        @click="click"
        alt="close icon"
      />
      <!--  -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { baseUrl } from '@/api/apiclient';
import { toPersianNumbers } from '@/utilities/to-persian-numbers';
export default defineComponent({
  props: {
    images: { type: String }
  },
  setup(props, { emit }) {
    const currentImgIdx = ref(0);
    const imgUrls = ref([] as string[]);
    const imgs = JSON.parse(props.images as any);
    imgs?.forEach(async (img) => {
      const imageUrl = `${baseUrl}question/image/${img.file}`;
      imgUrls.value.push(imageUrl);
    });
    const moveImg = (amountTomove) => {
      if (
        currentImgIdx.value + amountTomove >= 0 &&
        currentImgIdx.value + amountTomove <= imgUrls.value.length - 1
      ) {
        currentImgIdx.value += amountTomove;
      }
    };

    const click = () =>
      setTimeout(() => {
        // Run after a bit of time so we don't accidentally touch footer component
        emit('convertBoolean');
      }, 150);

    return { click, imgUrls, currentImgIdx, moveImg, toPersianNumbers };
  }
});
</script>

<style lang="scss">
.image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
}
.x-icon {
  padding: 4px;
  background: white;
  border-radius: 45%;
  display: block;
  position: fixed;
  margin-bottom: 7vh;
  margin-top: 3rem;
  bottom: 0;
}

.flex-child {
  min-height: 60vh;
  max-height: 600px;
  max-height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .img-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    max-width: 450px;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;

    i {
      margin-right: 0.75rem;
      margin-left: 0.75rem;
    }

    .img {
      width: 100%;
      min-height: 12.5rem;
      display: flex;
      padding: 0.7rem;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      overflow: hidden;

      figcaption {
        font-size: 0.66rem;
        font-family: IRANSans;
        margin-top: 0.5rem;
      }
      img {
        min-width: 75px;
        max-width: 100%;
        object-fit: contain;
        outline: 1px solid #ccc;
      }
    }
  }
}
</style>
