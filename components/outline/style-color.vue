<script setup lang="ts">
import { SkyColor } from '~/lib/editor/model';
import tinycolor from 'tinycolor2';
import { computed, ref } from 'vue';
import CopyableText from '~/components/outline/copyable-text.vue';
import SketchFormat from '@sketch-hq/sketch-file-format-ts';

const colorSpaces = ['rgb', 'prgb', 'hex8', 'hsl', 'hsv', 'name'];
const colorSpacesIndex = ref<number>(0);
const colorType = ref(colorSpaces[colorSpacesIndex.value]);

const props = defineProps<{ color: SkyColor; swatches?: SketchFormat.Swatch[] }>();
const swatches = props.swatches;

let colorStr = ref<string>('');

const colorInfo = computed(() => {
  const skyColor =
    (props.color as SkyColor) ||
    ({
      json: { red: 0, green: 0, blue: 0, _class: 'color', alpha: 1, swatchID: undefined },
    } as SkyColor);

  const color = tinycolor.fromRatio({
    r: skyColor.json.red,
    g: skyColor.json.green,
    b: skyColor.json.blue,
    a: skyColor.json.alpha,
  });
  colorStr.value = color.toString(colorType.value);
  const swatch = (swatches || []).find((s) => s.do_objectID === skyColor.json.swatchID) || {};
  return {
    swatch,
    color,
  };
});

const { swatch, color } = colorInfo.value;

const changeColorSpace = () => {
  colorSpacesIndex.value = (colorSpacesIndex.value + 1) % colorSpaces.length;
  colorType.value = colorSpaces[colorSpacesIndex.value];
  colorStr.value = color.toString(colorType.value);
};
</script>
<template>
  <div class="color">
    <i title="点击切换颜色类型" :onclick="changeColorSpace" :style="{ backgroundColor: colorStr }">
      {{ colorSpaces[colorSpacesIndex.value] }}
    </i>
    <span class="inp hexa"><CopyableText :text="colorStr" /></span>
  </div>
  <span style="font-size: 12px; color: #a4a4a4">{{ swatch.name }}</span>
</template>

<style scoped>
.color-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

</style>
