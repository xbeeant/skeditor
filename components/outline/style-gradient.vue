<script setup lang="ts">
import { FillType } from '@sketch-hq/sketch-file-format-ts/dist/esm/types';
import Color from '~/components/outline/style-color.vue';
import { SkyFill } from '~/lib/editor/model';
const props = defineProps<{ fills: SkyFill[] }>();
const fills = props.fills || [];

console.log('fills' , props);
</script>

<template>
  <section class="prop-box" v-if="fills && fills.length > 0">
    <h5 class="fill-title"><span>填充</span></h5>
    <div v-for="fill in fills">
      <dl class="item" v-if="fill.fillType === FillType.Gradient">
        <dt>渐变</dt>
      </dl>
      <ul class="fill-list" v-if="fill.fillType === FillType.Gradient">
        <li v-for="gradientStop in fill.gradient.stops">
          <div title="title" class="title">{{ gradientStop.position * 100 + '%' }}</div>
          <dd>
            <div class="inp m2"> <Color :color="{ json: gradientStop.color.json }" /> </div>
          </dd>
        </li>
      </ul>
      <dl class="item" v-if="fill.fillType === FillType.Pattern">
        <dt>图案</dt>
      </dl>
      <dl class="item" v-if="fill.fillType === FillType.Color">
        <dt>颜色</dt>
        <dd>
          <Color :color="fill.color" />
        </dd>
      </dl>
    </div>
  </section>
</template>

<style scoped>
h5 {
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

dl.item {
  height: 36px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
  padding: 0 15px;
}

dl.item > dt {
  width: 72px;
  white-space: nowrap;
  height: 22px;
  line-height: 22px;
  color: #6b7980;
  font-size: 12px;
}

.fill-list {
  position: relative;
}

.fill-list:before {
  content: '';
  width: 3px;
  height: calc(100% - 36px);
  position: absolute;
  box-shadow: 0 0 4px 0 rgba(144, 153, 172, 0.5);
  background: #fff;
  left: 18px;
  top: 15px;
}

.fill-list li {
  position: relative;
  margin-left: 20px;
  display: flex;
  align-items: center;
}

.fill-list li .title {
  width: 56px;
  text-align: right;
  padding-left: 5px;
}

.fill-list li:before {
  content: '';
  width: 9px;
  height: 9px;
  position: absolute;
  box-shadow: 0 0 4px 0 rgba(144, 153, 172, 0.5);
  background: #fff;
  border-radius: 50%;
  left: -5px;
  top: 13px;
}
</style>
