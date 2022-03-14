<template>
  <div ref="chapter" class="chapter" @click="touch">
    <span>
      {{ text }}
    </span>
    <div class="img">
      <img src="@/assets/img/azmoon-icons/accept-path-light.png" alt="active" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: ['text', 'chapterContainer'],
  setup(props, { emit }) {
    const chapter = ref(null) as any;
    const touch = () => {
      // Remove The Class From All The Siblings
      props.chapterContainer
        .querySelectorAll('.chapter')
        .forEach((chapter: any) => {
          chapter.classList.remove('active');
        });
      // Add It to current Card
      chapter.value.classList.add('active');
      // Change This With Id Or Something Later
      emit('changeCurrentItem', props.text);
    };

    return { touch, chapter };
  }
});
</script>

<style lang="scss">
// Giving Some Margin To Last Child
.chapter {
  margin: 0.5rem auto;
  padding: 1rem;
  box-shadow: 0 11px 17px 0 rgba(41, 94, 255, 0.05);
  background-color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  span {
    font-family: IRANSans;
    font-size: 12px;
    color: #171717;
  }
  .img {
    width: 27px;
    height: 27px;
    padding: 7px;
    background-color: #d3d7e0;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      object-fit: contain;
    }
  }
}
.chapter.active {
  span {
    color: #171717;
    font-weight: bold;
  }

  .img {
    background-color: #ff5960;
  }
}
</style>
