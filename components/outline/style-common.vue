<template>
  <section class="prop-box">
    <dl class="item node-name">
      <dt>图层</dt>
      <dd class="cur-node-name">
        <div class="node-name non-export">
          <div :title="model.name">{{ model.name }}</div>
        </div>
      </dd>
    </dl>
    <h5>位置</h5>
    <dl class="item loc">
      <dd>
        <span class="loc-name mid">X</span>
        <div class="inp">
          <CopyableText :text="`${(model.frame.x * unit.scale).toFixed()}${unit.unit}`" />
        </div>
        <span class="loc-name">Y</span>
        <div class="inp m2">
          <CopyableText :text="`${(model.frame.y * unit.scale).toFixed()}${unit.unit}`" />
        </div>
      </dd>
    </dl>
    <h5>大小</h5>
    <dl class="item loc">
      <dd>
        <span class="loc-name mid">宽度</span>
        <div class="inp">
          <CopyableText :text="`${(model.frame.width * unit.scale).toFixed()}${unit.unit}`" />
        </div>
        <span class="loc-name">高度</span>
        <div class="inp m2">
          <CopyableText :text="`${(model.frame.height * unit.scale).toFixed()}${unit.unit}`" />
        </div>
      </dd>
    </dl>
    <h5>属性</h5>
    <dl class="item loc">
      <dd>
        <span class="loc-name mid">不透明度</span>
        <div class="inp">
          <CopyableText :text="`${(model.style.contextSettings.opacity * 100).toFixed()}%`" />
        </div>
        <span class="loc-name" v-if="model.fixedRadius">圆角</span>
        <div class="inp m2" v-if="model.fixedRadius">
          <CopyableText :text="`${(model.fixedRadius * unit.scale).toFixed()}${unit.unit}`" />
        </div>
      </dd>
    </dl>
  </section>
</template>
<script lang="ts"></script>
<script setup lang="ts">
import { EditorState } from '~/components/editor-state';
import { AnyLayer } from '@sketch-hq/sketch-file-format-ts/dist/esm/types';
import { SkyBaseLayer } from '~/lib/editor/model';
import CopyableText from '~/components/outline/copyable-text.vue';
import { computed } from 'vue';

const props = defineProps<{ model: SkyBaseLayer<AnyLayer>; unit: { name: string; unit: string; scale: number } }>();

const unit = computed(() => {
  return props['unit'];
});
const model = computed(() => {
  return props['model'];
});
</script>
<style scoped></style>
