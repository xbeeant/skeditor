<script setup lang="ts">
import { AnyLayer, FillType } from '@sketch-hq/sketch-file-format-ts/dist/esm/types';
import Color from '~/components/outline/style-color.vue';
import { SketchFormat, SkyBaseLayer } from '~/lib/editor/model';
import { computed } from 'vue';

const props = defineProps<{ model: SkyBaseLayer<AnyLayer>; swatches: SketchFormat.Swatch[] }>();

const swatches = computed(() => {
  return props['swatches'];
});

const fills = computed(() => {
  return props['model']?.style?.fills || [];
});
</script>

<template>
  <section class="prop-box" v-show="fills && fills.length > 0">
    <h5 class="fill-title"><span>填充</span></h5>
    <div v-for="fill in fills">
      <div v-if="fill.isEnabled">
        <dl class="item" v-if="fill.fillType === FillType.Gradient">
          <dt>渐变</dt>
        </dl>
        <ul class="fill-list" v-if="fill.fillType === FillType.Gradient">
          <li v-for="gradientStop in fill.gradient.stops">
            <div class="title">{{ gradientStop.position * 100 + '%' }}</div>
            <dl class="item color-item">
              <dd>
                <div class="container"> <Color :color="{ json: gradientStop.color.json }" :swatches="swatches" /> </div>
              </dd>
            </dl>
          </li>
        </ul>
        <dl class="item" v-if="fill.fillType === FillType.Pattern">
          <dt>图案</dt>
        </dl>
        <dl class="item color-item" v-if="fill.fillType === FillType.Color">
          <dt>颜色</dt>
          <dd>
            <Color :color="fill.color" :swatches="swatches" />
          </dd>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
