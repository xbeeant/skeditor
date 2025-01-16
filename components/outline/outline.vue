<template>
  <section :style="`width: ${width}px;`" class="outline">
    <Pages />
    <Layers />
    <Sash :side="'right'" @dragStart="onDragStart" @offset="onOffset" />
  </section>
</template>
<script lang="ts"></script>
<script setup lang="ts">
import Pages from './pages.vue';
import Layers from './layers.vue';
import Sash from '~/components/ui/sash.vue';
import { setupRightOutline } from './outline-business';

const { width, onDragStart, onOffset } = setupRightOutline();

</script>
<style scoped>
.outline {
  position: relative;
  box-shadow: rgba(9, 30, 66, 0.25) 0 4px 8px -2px, rgba(9, 30, 66, 0.08) 0 0 0 1px;
  background-color: #ffffff;
  display: flex;
  margin-right: 1px;
  flex-direction: column;
}
</style>
