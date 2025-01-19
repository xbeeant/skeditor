<template>
  <div class="copyable-text" @click="copyText">
    <span>{{ text }}</span>
    <span v-if="showTooltip" class="tooltip">已复制</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import copy from 'copy-to-clipboard';

const props = defineProps<{
  text: string;
}>();

const showTooltip = ref(false);

const copyText = async () => {
  try {
    copy(props.text)
    showTooltip.value = true;
    setTimeout(() => {
      showTooltip.value = false;
    }, 2000); // 2秒后隐藏提示
  } catch (err) {
    console.error('无法复制文本: ', err);
  }
};
</script>

<style scoped>
.copyable-text {
  position: relative;
  cursor: pointer;
  display: inline-block;
}

.tooltip {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #ffffff;
  border-radius: 4px;
  white-space: nowrap;
  margin-bottom: 5px;
  opacity: 0.9;
}
</style>
