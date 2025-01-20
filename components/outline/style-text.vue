<script setup lang="ts">
import { AnyLayer } from '@sketch-hq/sketch-file-format-ts/dist/esm/types';
import Color from '~/components/outline/style-color.vue';
import { SketchFormat, SkyBaseLayer, SkyText } from '~/lib/editor/model';
import { computed } from 'vue';
import CopyableText from '~/components/outline/copyable-text.vue';

const props = defineProps<{
  model: SkyBaseLayer<AnyLayer>;
  swatches: SketchFormat.Swatch[];
  unit: { name: string; unit: string; scale: number };
}>();
const model = computed(() => {
  return props['model'];
});

const swatches = computed(() => {
  return props['swatches'];
});

const unit = computed(() => {
  return props['unit'];
});

const textBehaviour = {
  0: '自动宽度',
  1: '自动高度',
  2: '固定尺寸',
};
</script>

<template>
  <section v-if="model && model._class === 'Text'">
    <section class="prop-box">
      <h5>文本</h5>
      <dl class="item">
        <dt>字体</dt>
        <dd>
          <div class="inp">
            <CopyableText
              :text="`${model.style.textStyle.encodedAttributes.MSAttributedStringFontAttribute.attributes.name}`"
            />
          </div>
        </dd>
      </dl>
      <dl class="item color-item">
        <dt>前景色</dt>
        <dd>
          <Color
            :color="{ json: model.style?.textStyle?.encodedAttributes.MSAttributedStringColorAttribute }"
            :swatches="swatches"
          />
        </dd>
      </dl>
      <dl class="item">
        <dt>字号</dt>
        <dd>
          <div class="inp">
            <CopyableText
              :text="`${model.style.textStyle.encodedAttributes.MSAttributedStringFontAttribute.attributes.size}${unit.unit}`"
            />
          </div>
          <div class="inp m2 empty"></div>
        </dd>
      </dl>
      <dl class="item">
        <dt>行高</dt>
        <dd>
          <div class="inp">
            <CopyableText
              :text="`${model.style.textStyle.encodedAttributes.paragraphStyle.maximumLineHeight || '自动'}`"
            />
          </div>
          <div class="inp m2 empty"></div>
        </dd>
      </dl>
      <dl class="item">
        <dt>对齐方式</dt>
        <dd>
          <div class="inp">
            <span title="left">
              <CopyableText :text="`${textBehaviour[(model as SkyText).textBehaviour]}`" />
            </span>
          </div>
          <div class="inp m2 empty"></div>
        </dd>
      </dl>
    </section>
    <h5 class="mult-h5"> 文本内容</h5>
    <dl class="item mult">
      <dd>
        <div class="inp multiple">
          <CopyableText :text="`${model.attributedString.string}`" />
        </div>
      </dd>
    </dl>
  </section>
</template>

<style scoped></style>
