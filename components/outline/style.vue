<template>
  <section v-if="model" :style="`width: ${width}px; position: absolute; right: 0;`" class="outline node-properties">
    <main>
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

      <StyleGradient />

      <section v-if="model._class === 'Text'">
        <section class="prop-box">
          <h5>文本</h5>
          <dl class="item">
            <dt>字体</dt>
            <dd>
              <div class="inp">
                <CopyableText :text="`${model.style.textStyle.encodedAttributes.MSAttributedStringFontAttribute.attributes.name}`" />
              </div>
            </dd>
          </dl>
          <dl class="item">
            <dt>前景色</dt>
            <dd>
              <Color :color="{ json: model.style?.textStyle?.encodedAttributes.MSAttributedStringColorAttribute }" />
            </dd>
          </dl>
          <dl class="item">
            <dt>字号</dt>
            <dd>
              <div class="inp">
                <CopyableText :text="`${model.style.textStyle.encodedAttributes.MSAttributedStringFontAttribute.attributes.size}`" />
              </div>
              <div class="inp m2 empty"></div>
            </dd>
          </dl>
          <dl class="item">
            <dt>行高</dt>
            <dd>
              <div class="inp">
                <CopyableText :text="`${model.style.textStyle.encodedAttributes.paragraphStyle.maximumLineHeight || '自动'}`" />
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
        <h5 class="mult-h5"> 文本内容 <a href="javascript:;" class="copy">复制文本</a></h5>
        <dl class="item mult">
          <dd>
            <div class="inp multiple">
              <CopyableText :text="`${model.attributedString.string}`" />
            </div>
          </dd>
        </dl>
      </section>
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
import { AnyLayer } from '@sketch-hq/sketch-file-format-ts/dist/esm/types';
import { SkyBaseLayer, SkyFill, SkyText } from '~/lib/editor/model';
import Color from '~/components/outline/style-color.vue';
import StyleGradient from '~/components/outline/style-gradient.vue';
import CopyableText from '~/components/outline/copyable-text.vue';

const { width, onDragStart, onOffset } = setupLeftOutline();
const { selectedLayerIdRef, unit } = EditorState.shared;
const model = ref<SkyBaseLayer<AnyLayer> | undefined>();
const fills = ref<SkyFill[] | undefined>();

const textBehaviour = {
  0: '自动宽度',
  1: '自动高度',
  2: '固定尺寸',
};

watch(selectedLayerIdRef, () => {
  nextTick(() => {
    model.value = EditorState.shared.selectedLayerModel;
    if (model.value) {
      fills.value = model.value.style?.fills || [];
      console.log(model.value, model.value.style?.fills, fills.value, model.value.refModel);
    }
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

.node-properties {
  height: calc(100% - 36px);
  top: 36px;
  background: #fff;
  transition: -webkit-transform 0.2s ease-in-out;
}

.node-properties h5 {
  height: 32px;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  padding-left: 15px;
  font-size: 12px;
  color: #333;
  margin: 8px 0;
  user-select: none;
}

.node-properties h5.mult-h5 {
  justify-content: space-between;
  padding-right: 17px;
}

.node-properties h5.mult-h5 .copy {
  font-weight: 400;
  color: #333;
}

.node-properties h5.mult-h5 .copy:hover {
  color: #1886ff;
}

.node-properties.on {
  transform: translateZ(0);
  box-shadow: -4px 2px 6px 0 rgba(59, 83, 126, 0.12);
}

.node-properties > main {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
}

.node-properties > main.export {
  height: calc(100% - 96px);
}

.node-properties > main:after {
  content: '';
  height: 10px;
  display: block;
  overflow: hidden;
}

.node-properties > footer,
.node-properties > footer .button {
  height: 48px;
}

.node-properties > footer .button:after {
  border: 1px solid #b4b4b4;
  border-width: 1px 1px 0 0;
  content: '';
  transform: rotate(45deg);
  width: 4px;
  height: 4px;
  margin-left: 4px;
  margin-top: 2px;
}

.node-properties > footer .button:hover {
  background: #f6f6f6;
}

.node-properties > footer .button.download-all {
  border-radius: 0;
  border-right: none;
  border-left: none;
  border-bottom: none;
}

.node-properties dl.item {
  height: 36px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
  padding: 0 15px;
}

.node-properties dl.item.opa dt {
  width: 90px;
}

.node-properties dl.item.loc dt {
  width: 36px;
}

.node-properties dl.item.loc .loc-name {
  min-width: 36px;
  max-width: 48px;
  padding-right: 5px;
  font-size: 12px;
  color: #6b7980;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: content-box;
  white-space: nowrap;
}

.node-properties dl.item.loc .loc-name.big {
  padding-left: 36px;
}

.node-properties dl.item.loc .loc-name.mid,
.node-properties dl.item.loc .loc-name.start {
  justify-content: start;
}

.node-properties dl.item.loc .m2 {
  margin-left: 0;
}

.node-properties dl.item.mult {
  align-items: flex-start;
  margin-bottom: 10px;
  height: auto;
}

.node-properties dl.item > dt {
  min-width: 32px;
  white-space: nowrap;
  height: 22px;
  line-height: 22px;
  color: #6b7980;
  font-size: 12px;
}

.node-properties dl.item > dd {
  flex: 1;
  width: 0;
}

.node-properties .inp,
.node-properties dl.item > dd {
  display: flex;
}

.node-properties .inp {
  height: 22px;
  line-height: 22px;
  border: 1px solid #e7e7e7;
  background: #f6f6f6;
  border-radius: 3px;
  align-items: center;
  white-space: nowrap;
  color: #333;
  flex: 1;
  margin-right: 8px;
  overflow: hidden;
}

.node-properties .inp.empty {
  border: none;
  background: none;
}

.node-properties .inp span {
  box-sizing: border-box;
  padding: 0 8px;
  text-overflow: ellipsis;
  display: block;
  width: 100%;
  overflow: hidden;
  user-select: all;
  font-size: 13px;
}

.node-properties .inp.m2 {
  margin-left: 8px;
}

.node-properties .inp.multiple {
  height: auto;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 300px;
  overflow: hidden;
  overflow-y: auto;
  display: block;
}

.node-properties .inp.multiple > span {
  padding: 12px;
  user-select: initial;
}

.node-properties .inp.rgba {
  min-width: 150px;
  white-space: nowrap;
}

.node-properties .inp.hex {
  min-width: 75px;
  white-space: nowrap;
}

.node-properties .inp.ahex,
.node-properties .inp.hexa {
  min-width: 85px;
  white-space: nowrap;
}

.node-properties .inp.hsla {
  min-width: 165px;
  white-space: nowrap;
}

.node-properties .inp.opacity {
  margin-left: 8px;
  width: 52px;
  min-width: 52px;
  white-space: nowrap;
  flex: initial;
}

.node-properties .inp.opacity span {
  text-overflow: clip;
  width: auto;
}

.draw-control-sub .box .colors {
  display: flex;

  align-items: center;
}

.draw-control-sub .box .colors:before {
  content: '';
  background: hsla(0, 0%, 59.2%, 0.17);
  height: 24px;
  width: 1px;
  margin: 0 10px;
}

.draw-control-sub .box .colors li {
  border-radius: 50%;
  width: 24px;
  height: 24px;
  border: 2px solid transparent;
  margin: 0 1px;
  cursor: pointer;
  position: relative;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.draw-control-sub .box .colors li span {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid;
}

.draw-control-sub .box .colors li.on,
.draw-control-sub .box .colors li:hover {
  border-color: #1886ff;
}

.colors li {
  height: 26px;
  line-height: 26px;
  color: #333;
  padding: 0 20px 0 13px;
  cursor: default;
}

.colors li:hover {
  background: #f5f5f5;
  color: #333;
}

.colors li.on {
  background: #1886ff;
  color: #fff;
}

.item dd .color i {
  flex-shrink: 0;
  height: 22px;
  width: 22px;
  border-radius: 4px 0 0 4px;
  margin-right: 14px;
  cursor: pointer;
  border: 1px solid #e7e7e7;
  position: relative;
}

.item dd .color i:after {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAsCAMAAABWi7jCAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA4ZVhJZk1NACoAAAAIAAGHaQAEAAAAAQAAABoAAAAAAAKgAgAEAAAAAQAAABagAwAEAAAAAQAAACwAAAAA1HixRwAAAEJQTFRF7+/v////o6OjxcXF5ubm5ubm5+fn5ubmTGlx5+fn+fn5tLS03Nzcy8vL7u7u9PT04uLi/Pz8+/v70dHR1tbWubm5AvcgWgAAAAp0Uk5TEP///4/i/5EA4JYQ3eEAAACQSURBVCjP3dPLEoMgDAXQ3MSijaC1j///VekAowNx2unOZnkW4QYIubY6GshZRZFR1TK53mDc3dVixC7n5xAsFmbRhoVFeNSKowLP7IV1fCvgk2eO+kitkmee2JcQnm9bk3nLrD9PuWsy4+OROXYVECrWOGX4UA1fruql5sV+/wz/9tl2K3U5XsCDdW2qp2EFKvcLMOa75VQAAAAASUVORK5CYII=);
  content: '';
  width: 11px;
  height: 22px;
  position: absolute;
  right: -11px;
  top: -1px;
}

.item dd .color i:hover:after {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAsCAMAAABWi7jCAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAA4ZVhJZk1NACoAAAAIAAGHaQAEAAAAAQAAABoAAAAAAAKgAgAEAAAAAQAAABagAwAEAAAAAQAAACwAAAAA1HixRwAAAEVQTFRF7+/v+Pj4o6Oj8vLy5ubm5ubm5+fn5ubmTGlx5+fnw8PDs7Oz2NjYwsLCyMjI9vb27u7u6Ojo3d3d7Ozszs7OuLi40tLSfzvbjQAAAAp0Uk5TEP///4/i/5EA4JYQ3eEAAACTSURBVCjP3dPLEoIwDAXQPLRA+gAV/f9PtZoyYBtGx51meRa3SduAa+sAPTirIDNWNV5cZzCObrAYc8rvc0oWC1HkhoVEyHPFWRFvxRdm/1DEoF4466xR6oVPFJYmAp3XkGntmb+echMy4dsjPUWjQWRRfx3nOXz2VA2vHunK1sXK58/wb59ts1LH/QXcWdemOujvrZ0LeooD95oAAAAASUVORK5CYII=);
}

.unit-box .sub-title {
  font-size: 12px;
  background: #000;
  color: #3a3a3a;
}
</style>
