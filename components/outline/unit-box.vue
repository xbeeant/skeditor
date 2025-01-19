<script setup lang="ts">
import { setupLeftOutline } from './outline-business';
import Sash from '~/components/ui/sash.vue';
import { EditorState } from '~/components/editor-state';
const { width, onDragStart, onOffset } = setupLeftOutline();
const selectedUnit = EditorState.shared.unit;
// 设备列表
const unitsData = [
  {
    name: '设备切换',
    units: [
      { name: '网页 - px', unit: 'px', scale: 1 },
      { name: 'iOS设备 - pt', unit: 'pt', scale: 1 },
      { name: 'Android设备 - dp/sp', unit: 'dp', scale: 1 },
    ],
  },
  {
    name: '转换为像素值',
    units: [
      { name: 'IOS 标准点 @1x', unit: 'px', scale: 1 },
      { name: 'IOS 视网膜 @2x', unit: 'px', scale: 2 },
      { name: 'IOS 高清视网膜 @3x', unit: 'px', scale: 3 },
      { name: 'Android LDPI @0.75x', unit: 'px', scale: 0.75 },
      { name: 'Android MDPI @1x', unit: 'px', scale: 1 },
      { name: 'Android HDPI @1.5x', unit: 'px', scale: 1.5 },
      { name: 'Android XHDPI @2x', unit: 'px', scale: 2 },
      { name: 'Android XXHDPI @3x', unit: 'px', scale: 3 },
      { name: 'Android XXXHDPI @4x', unit: 'px', scale: 4 },
    ],
  },
  {
    name: '转换为其他',
    units: [
      { name: 'CSS Rem 8px', unit: 'rem', scale: 1 / 8 },
      { name: 'CSS Rem 10px', unit: 'rem', scale: 1 / 10 },
      { name: 'CSS Rem 12px', unit: 'rem', scale: 1 / 12 },
      { name: 'CSS Rem 14px', unit: 'rem', scale: 1 / 14 },
      { name: 'CSS Rem 16px', unit: 'rem', scale: 1 / 16 },
      { name: 'Ubuntu 网格', unit: 'gu', scale: 1 / 27 },
    ],
  },
];

const changeUnit = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const name = target.dataset.name as string;
  const unit = target.dataset.unit as string;
  const scale = Number(target.dataset.scale) as number;
  EditorState.shared.unit.value = { name: name, unit: unit, scale: scale };
  EditorState.shared.showUnitbox.value = false;
};
</script>

<template>
  <section :style="`width: ${width}px; position: absolute; right: 0;`" class="outline">
    <main>
      <div class="unit-box">
        <ul v-for="unitGroup in unitsData">
          <li class="sub-title">{{ unitGroup.name }}</li>
          <li v-for="unit in unitGroup.units">
            <label>
              <input
                :checked="selectedUnit.name === unit.name"
                type="radio"
                name="resolution"
                @change="changeUnit"
                :data-name="unit.name"
                :data-unit="unit.unit"
                :data-scale="unit.scale"
              />
              <span>{{ unit.name }}</span>
            </label>
          </li>
        </ul>
      </div>
    </main>
    <Sash :side="'left'" @dragStart="onDragStart" @offset="onOffset" />
  </section>
</template>

<style scoped>
.outline {
  position: relative;
  box-shadow: rgba(9, 30, 66, 0.25) 0 4px 8px -2px, rgba(9, 30, 66, 0.08) 0 0 0 1px;
  background-color: #ffffff;
  display: flex;
  margin-right: 1px;
  flex-direction: column;
  height: 100%;
  top: 36px;
}

.sub-title {
  height: 32px;
  background: #f8f8f8;
  display: flex;
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

.unit-box label {
  cursor: pointer;
}
.unit-box .sub-title,
.unit-box label {
  display: flex;
  padding: 8px 20px;
}
</style>
