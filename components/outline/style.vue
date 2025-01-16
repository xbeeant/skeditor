<template>
  <section :style="`width: ${width}px;`" class="outline node-properties">
    <main class="" v-if="model">
      <section class="prop-box">
        <dl class="item node-name">
          <dt>图层</dt>
          <dd class="cur-node-name">
            <div class="node-name non-export">
              <div title="{{model.name}}">{{ model.name }}</div>
            </div>
          </dd>
        </dl>
        <h5>比例</h5>
        <dl class="item loc">
          <dd>
            <span class="loc-name mid">X</span>
            <div class="inp"
              ><span title="{{model.frame.x}}dp">{{ model.frame.x }}dp</span>
            </div>
            <span class="loc-name">Y</span>
            <div class="inp m2"
              ><span title="{{model.frame.y}}dp">{{ model.frame.y }}dp</span>
            </div>
          </dd>
        </dl>
        <dl class="item loc">
          <dd>
            <span class="loc-name mid">W</span>
            <div class="inp">
              <span title="{{model.frame.width}}dp">{{ model.frame.width }}dp</span>
            </div>
            <span class="loc-name">H</span>
            <div class="inp m2">
              <span title="{{model.frame.height}}dp">{{ model.frame.height }}dp</span>
            </div>
          </dd>
        </dl>
        <dl class="item">
          <dt title="当前图层的不透明度">不透明度</dt>
          <dd>
            <div class="inp"><span title="100%">100%</span></div>
            <div class="inp empty"></div>
          </dd>
        </dl>
      </section>
      <section v-if="model._class === 'text'">
        <section class="prop-box">
          <h5>文本</h5>
          <dl class="item">
            <dt>字体</dt>
            <dd>
              <div class="inp">
                <span
                  title="{{model.style.textStyle.encodedAttributes.MSAttributedStringFontAttribute.attributes.name}}"
                >
                  {{ model.style.textStyle.encodedAttributes.MSAttributedStringFontAttribute.attributes.name }}
                </span>
              </div>
            </dd>
          </dl>
          <dl class="item">
            <dt>字重</dt>
            <dd>
              <div class="inp">
                <span title="normal">normal</span>
              </div>
              <div class="inp m2">
                <span
                  title="{{model.style.textStyle.encodedAttributes.MSAttributedStringFontAttribute.attributes.size}}"
                >
                  {{ model.style.textStyle.encodedAttributes.MSAttributedStringFontAttribute.attributes.size }}
                </span>
              </div>
            </dd>
          </dl>
          <dl class="item">
            <dt>前景色</dt>
            <dd>
              <div class="container">
                <div class="color">
                  <i title="点击切换颜色类型" style="background-color: rgb(43, 44, 46)"></i>
                  <span class="inp rgba"><span title="rgba(43, 44, 46, 1)">rgba(43, 44, 46, 1)</span></span>
                </div>
              </div>
            </dd>
          </dl>
          <dl class="item">
            <dt>字号</dt>
            <dd>
              <div class="inp">
                <span
                  title="{{model.style.textStyle.encodedAttributes.MSAttributedStringFontAttribute.attributes.size}}"
                >
                  {{ model.style.textStyle.encodedAttributes.MSAttributedStringFontAttribute.attributes.size }}
                </span>
              </div>
              <div class="inp m2 empty"></div>
            </dd>
          </dl>
          <dl class="item">
            <dt>行高</dt>
            <dd>
              <div class="inp">
                <span title="{{model.style.textStyle.encodedAttributes.paragraphStyle.maximumLineHeight}}">
                  {{ model.style.textStyle.encodedAttributes.paragraphStyle.maximumLineHeight }}
                </span>
              </div>
              <div class="inp m2 empty"></div>
            </dd>
          </dl>
          <dl class="item">
            <dt>对齐方式</dt>
            <dd>
              <div class="inp"><span title="left">left</span></div>
              <div class="inp m2 empty"></div>
            </dd>
          </dl>
        </section>
        <h5 class="mult-h5"> 文本内容 <a href="javascript:;" class="copy">复制文本</a></h5>
        <dl class="item mult">
          <dd>
            <div class="inp multiple">
              <span title="{{model.attributedString.string}}">
                {{ model.attributedString.string }}
              </span>
            </div>
          </dd>
        </dl>
      </section>
      <section class="prop-box">
        <h5 class="fill-title"><span>填充</span></h5>
        <div>
          <dl class="item">
            <dt>线性渐变</dt>
            <dd>
              <div class="inp"><span title="linear">linear</span></div>
              <div class="inp m2"><span title="90deg">90deg</span></div>
            </dd>
          </dl>
          <ul class="fill-list">
            <li>
              <div class="title">0%</div>
              <dl class="item">
                <dd>
                  <div class="container">
                    <div class="color">
                      <i title="点击切换颜色类型" style="background-color: rgb(255, 237, 99)"></i>
                      <span class="inp rgba">
                        <span title="rgba(255, 237, 99, 1)">rgba(255, 237, 99, 1)</span>
                      </span>
                    </div>
                  </div>
                </dd>
              </dl>
            </li>
            <li>
              <div class="title">100%</div>
              <dl class="item">
                <dd>
                  <div class="container">
                    <div class="color">
                      <i title="点击切换颜色类型" style="background-color: rgb(233, 193, 26)"></i>
                      <span class="inp rgba">
                        <span title="rgba(233, 193, 26, 1)">rgba(233, 193, 26, 1)</span>
                      </span>
                    </div>
                  </div>
                </dd>
              </dl>
            </li>
          </ul>
        </div>
      </section>
      <div></div>
    </main>
    <Sash :side="'left'" @dragStart="onDragStart" @offset="onOffset" />
  </section>
</template>
<script lang="ts"></script>
<script setup lang="ts">
import Sash from '~/components/ui/sash.vue';
import { setupLeftOutline } from './outline-business';
import { EditorState } from '~/components/editor-state';
import { nextTick, watch, ref } from 'vue';
import { AnyLayer } from '@sketch-hq/sketch-file-format-ts/dist/esm/types';

const { width, onDragStart, onOffset } = setupLeftOutline();
const { selectedLayerIdRef } = EditorState.shared;
let model = ref<AnyLayer | undefined>();
watch(selectedLayerIdRef, () => {
  nextTick(() => {
    const selectedLayerModel = EditorState.shared.selectedLayerModel;
    model.value = selectedLayerModel?.json as AnyLayer | undefined;
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
  height: 100%;
  background: #fff;
  -webkit-transition: -webkit-transform 0.2s ease-in-out;
  transition: -webkit-transform 0.2s ease-in-out;
}

.node-properties h5 {
  height: 32px;
  background: #f8f8f8;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  padding-left: 15px;
  font-size: 12px;
  color: #333;
  margin: 8px 0;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.node-properties h5.mult-h5 {
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
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
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-box-shadow: -4px 2px 6px 0 rgba(59, 83, 126, 0.12);
  box-shadow: -4px 2px 6px 0 rgba(59, 83, 126, 0.12);
}

.node-properties > main {
  height: calc(100% - 48px);
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
  -webkit-transform: rotate(45deg);
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
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
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
  width: 36px;
  font-size: 12px;
  color: #6b7980;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  white-space: nowrap;
}

.node-properties dl.item.loc .loc-name.big {
  padding-left: 36px;
}

.node-properties dl.item.loc .loc-name.mid,
.node-properties dl.item.loc .loc-name.start {
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: start;
}

.node-properties dl.item.loc .loc-name.mid {
  width: 26px;
}

.node-properties dl.item.loc .m2 {
  margin-left: 0;
}

.node-properties dl.item.mult {
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;
  margin-bottom: 10px;
  height: auto;
}

.node-properties dl.item > dt {
  width: 72px;
  white-space: nowrap;
  height: 22px;
  line-height: 22px;
  color: #6b7980;
  font-size: 12px;
}

.node-properties dl.item > dd {
  -ms-flex: 1;
  flex: 1;
  width: 0;
}

.node-properties .inp,
.node-properties dl.item > dd {
  -webkit-box-flex: 1;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.node-properties .inp {
  height: 22px;
  line-height: 22px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #e7e7e7;
  background: #f6f6f6;
  border-radius: 3px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  white-space: nowrap;
  color: #333;
  -ms-flex: 1;
  flex: 1;
  overflow: hidden;
}

.node-properties .inp.empty {
  border: none;
  background: none;
}

.node-properties .inp span {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0 8px;
  text-overflow: ellipsis;
  display: block;
  width: 100%;
  overflow: hidden;
  -webkit-user-select: all;
  -moz-user-select: all;
  -ms-user-select: all;
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
  -webkit-user-select: initial;
  -moz-user-select: initial;
  -ms-user-select: initial;
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
  -webkit-box-flex: initial;
  -ms-flex: initial;
  flex: initial;
}

.node-properties .inp.opacity span {
  text-overflow: clip;
  width: auto;
}

.fill-list {
  position: relative;
}

.fill-list:before {
  content: '';
  width: 3px;
  height: calc(100% - 36px);
  position: absolute;
  -webkit-box-shadow: 0 0 4px 0 rgba(144, 153, 172, 0.5);
  box-shadow: 0 0 4px 0 rgba(144, 153, 172, 0.5);
  background: #fff;
  left: 18px;
  top: 15px;
}

.fill-list li {
  position: relative;
  margin-left: 20px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.fill-list li .title {
  width: 56px;
  text-align: right;
}

.fill-list li:before {
  content: '';
  width: 9px;
  height: 9px;
  position: absolute;
  -webkit-box-shadow: 0 0 4px 0 rgba(144, 153, 172, 0.5);
  box-shadow: 0 0 4px 0 rgba(144, 153, 172, 0.5);
  background: #fff;
  border-radius: 50%;
  left: -5px;
  top: 13px;
}

.draw-control-sub .box .colors {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
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
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
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

.colors {
  position: absolute;
  top: -60px;
  left: 30px;
  z-index: 9;
  background: #fff;
  -webkit-box-shadow: 0 0 6px 0 #a7c0dc;
  box-shadow: 0 0 6px 0 #a7c0dc;
  border-radius: 2px;
  border: 1px solid #c7c7c7;
  padding: 5px 0;
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

.item dd .container .swatch,
.item dd .container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.item dd .container .swatch {
  color: #828282;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  height: 16px;
  overflow: hidden;
}

.item dd .container .swatch .swatch-text {
  font-size: 12px;
  -webkit-transform: scale(0.83);
  transform: scale(0.83);
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item dd .color {
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.item dd .color i {
  -ms-flex-negative: 0;
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
</style>
