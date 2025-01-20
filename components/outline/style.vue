<template>
  <section v-if="modelSelected" :style="`width: ${width}px; position: absolute; right: 0;`" class="outline">
    <main class="node-properties">
      <StyleCommon :model="model" :unit="unit" />
      <StyleText :model="model" :swatches="swatches" :unit="unit" />
      <StyleGradient :model="model" :swatches="swatches" />
    </main>
    <Sash :side="'left'" @dragStart="onDragStart" @offset="onOffset" />
  </section>
</template>
<script lang="ts"></script>
<script setup lang="ts">
import Sash from '~/components/ui/sash.vue';
import { setupLeftOutline } from './outline-business';
import { EditorState } from '~/components/editor-state';
import { nextTick, ref, watch } from 'vue';
import StyleGradient from '~/components/outline/style-gradient.vue';
import StyleText from '~/components/outline/style-text.vue';
import StyleCommon from '~/components/outline/style-common.vue';
import { SketchFormat, SkyBaseLayer } from '~/lib/editor/model';
import { AnyLayer } from '@sketch-hq/sketch-file-format-ts/dist/esm/types';

const { width, onDragStart, onOffset } = setupLeftOutline();
const { selectedLayerIdRef, unit } = EditorState.shared;
const modelSelected = ref<boolean>(false);
const model = ref<SkyBaseLayer<AnyLayer> | undefined>();
const swatches = ref<SketchFormat.Swatch[]>([]);

watch(selectedLayerIdRef, () => {
  nextTick(() => {
    model.value = EditorState.shared.selectedLayerModel;
    modelSelected.value = model.value !== undefined;
    // @ts-expect-error
    swatches.value = model.value?.ctx.sharedSwatches || [];
  });
});
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
