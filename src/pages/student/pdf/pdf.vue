<template>
  <MinimalHeader title="کتاب" onePageBack="SelfTest" v-if="isMobile()" />
  <main class="book">
    <DesktopMinimalHeader v-if="!isMobile()" />
    <canvas v-if="!isLoading" id="canvas"></canvas>
    <div class="loader-parent" v-if="isLoading">
      <div class="loading1"></div>
    </div>

    <div class="page">
      <input
        type="number"
        v-model="pageNumber"
        @change="jumpToPage"
        :max="allPages"
        min="1"
      />
      <span> صفحه {{ pageNumber }} از {{ allPages }} </span>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { baseUrl } from '@/api/apiclient';
import { useRoute } from 'vue-router';
import DesktopMinimalHeader from '@/modules/student-modules/header/desktop-minimal.vue';
import MinimalHeader from '@/modules/student-modules/header/minimal-header.vue';
import { returnAProtectedUrl } from '@/utilities/get-image-from-url';

export default defineComponent({
  components: { DesktopMinimalHeader, MinimalHeader },
  setup() {
    const route = useRoute();
    const pdfHref = route.params.filename;
    const pdfUrl = `${baseUrl}session/download-file/${pdfHref}`;
    const isLoading = ref(true);
    const allPages = ref(0);
    const pageNumber = ref(1);
    let pdf;
    const increase = () => {
      if (pageNumber.value + 1 > allPages.value) {
        return;
      }
      pageNumber.value += 1;
      renderPage(pageNumber.value);
    };
    const decrease = () => {
      if (pageNumber.value - 1 < 1) {
        return;
      }
      pageNumber.value -= 1;

      renderPage(pageNumber.value);
    };

    returnAProtectedUrl(pdfUrl).then((res) => {
      isLoading.value = false;
      import('pdfjs-dist/legacy/build/pdf.min.js').then(async (pdfjsLib) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js';

        // Asynchronous download of PDF
        pdfjsLib
          .getDocument({
            url: res,
            disableFontFace: true
          })
          .promise.then((pdf_) => {
            allPages.value = pdf_.numPages;
            pdf = pdf_;
            renderPage(1);
          });
      });
    });

    const renderPage = (pageNumber) => {
      pdf.getPage(pageNumber).then((page) => {
        const viewport = page.getViewport({ scale: 1.5 });

        // Prepare canvas using PDF page dimensions
        const canvas = document.getElementById('canvas') as any;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        page.render(renderContext as any);
      });
    };

    const jumpToPage = () => {
      renderPage(pageNumber.value);
    };

    return { isLoading, pageNumber, increase, decrease, allPages, jumpToPage };
  }
});
</script>

<style lang="scss" scoped>
.book {
  width: 100%;
  height: 100%;
  position: relative;
  max-width: 750px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .page {
    position: relative;
    display: flex;
    background: #fff;
    margin-top: 8px;
    padding: 0.73rem 2rem;
    border-radius: 10px;

    span {
      border-right: 2px solid #ddd;
      padding-right: 1rem;
    }

    input {
      flex-grow: 1;
      border: none;
    }
  }

  #canvas {
    width: 100vw;
    max-height: 750px;
    max-width: 500px;
    margin: 0 auto;
  }
}
</style>
