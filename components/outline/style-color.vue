<script setup lang="ts">
import { SkyColor } from '~/lib/editor/model';
import { EditorState } from '~/components/editor-state';
import tinycolor from 'tinycolor2';
import { ref } from 'vue';
import CopyableText from '~/components/outline/copyable-text.vue';

const colorSpaces = ['rgb', 'prgb', 'hex8', 'hsl', 'hsv', 'name', ];
const colorSpacesIndex = ref<number>(0);
const colorType = ref(colorSpaces[colorSpacesIndex.value]);

const props = defineProps<{ color: SkyColor }>();
const modelRef = EditorState.shared.modelRef;
const swatches = modelRef.value?.sharedSwatches || [];
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
let colorStr = ref<string>(color.toString(colorType.value));

const swatch = swatches.find((s) => s.do_objectID === color.swatchID) || {};

const changeColorSpace = () => {
  colorSpacesIndex.value = (colorSpacesIndex.value + 1) % colorSpaces.length;
  colorType.value = colorSpaces[colorSpacesIndex.value];
  colorStr.value = color.toString(colorType.value);
};
</script>
<template>
  <div class="color-container">
    <div class="color">
      <label :onclick="changeColorSpace">
        <em> <i title="点击切换颜色类型" :style="{ backgroundColor: colorStr }">{{colorSpaces[colorSpacesIndex.value]}}</i></em>
      </label>
      <span class="inp"><CopyableText :text="colorStr" /></span>
    </div>
    <span>{{ swatch.name }}</span>
  </div>
</template>

<style scoped>
.color-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.color {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
}

.color label {
  margin-right: 8px;
}

.color .inp {
  height: 22px;
  line-height: 22px;
  border: 1px solid #e7e7e7;
  background: #f6f6f6;
  border-radius: 3px;
  white-space: nowrap;
  color: #333;
  overflow: hidden;
  padding: 0 8px;
}

.color label,
.color label em,
.color label em i {
  cursor: pointer;
  width: 24px;
  height: 24px;
  padding: 0;
  display: block;
}
</style>
