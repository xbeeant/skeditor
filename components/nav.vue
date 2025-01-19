<template>
  <nav class="nav">
    <NavButton @click="onToggleSidebar">
      <SidebarIcon :style="sideBarOpen ? '' : 'transform:rotate(180deg);'" />
    </NavButton>
    <NavButton @click="pick">
      <FileOpenIcon />
    </NavButton>
    <slot />
    <p class="doc-title text-overflow">{{ title }}</p>

    <NavButton @click="onScaleDown">
      <ScaleDownIcon />
    </NavButton>
    <NavButton style="width: 60px">
      <p class="p-scale">{{ scaleStr }}</p>
    </NavButton>
    <NavButton @click="onScaleUp">
      <ScaleUpIcon />
    </NavButton>
    <NavButton @click="onToggleUnitbox">
      <DeviceIcon :style="unitboxOpen" /> <span>{{ unit.name }}</span>
    </NavButton>
    <NavButton @click="onToggleStylebar">
      <SidebarIcon :style="styleBarOpen ? 'transform:rotate(180deg);' : ''" />
    </NavButton>
  </nav>
</template>
<script setup lang="ts">
import { computed, watch } from 'vue';
import NavButton from './nav-button.vue';
import ScaleUpIcon from '~/assets/svg-comp/scale-up.svg';
import DeviceIcon from '~/assets/svg-comp/device.svg';
import ScaleDownIcon from '~/assets/svg-comp/scale-down.svg';
import FileOpenIcon from '~/assets/svg-comp/file-open.svg';
import SidebarIcon from '~/assets/svg-comp/sidebar.svg';
import { EditorState } from './editor-state';
import { useSketchFilePicker } from './composables/file-picker';
import { useDropFile } from './composables/drop-file';

const emit = defineEmits<{
  (e: 'pick', value: File): void;
}>();

const sideBarOpen = EditorState.shared.showSidebar;
const styleBarOpen = EditorState.shared.showStylebar;
const unitboxOpen = EditorState.shared.showUnitbox;
const unit = EditorState.shared.unit;

const { pick } = useSketchFilePicker((file) => emit('pick', file));
const scaleRef = EditorState.shared.usePageScale();

const scaleStr = computed(() => {
  const scale = scaleRef.value || 1;
  return `${Math.round(scale * 100)}%`;
});

function onExportSelection() {
  EditorState.shared.view?.exportSelection();
}

function onScaleUp() {
  EditorState.shared.view?.services.viewport.scaleUp();
}

function onScaleDown() {
  EditorState.shared.view?.services.viewport.scaleDown();
}

const title = computed(() => EditorState.shared.editorTitle);

watch(useDropFile(), (file) => {
  if (file) {
    emit('pick', file);
  }
});

function onToggleSidebar() {
  sideBarOpen.value = !sideBarOpen.value;
}

function onToggleStylebar() {
  styleBarOpen.value = !styleBarOpen.value;
}

function onToggleUnitbox() {
  unitboxOpen.value = !unitboxOpen.value;
}
</script>

<style scoped>
.nav {
  background: black;
  height: 36px;
  color: white;
  display: flex;
  z-index: 1000;
  position: relative;
  align-items: center;
}

.doc-title {
  font-size: 16px;
  flex: 1;
  text-align: center;
  /* position: absolute;
  height: 100%;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center; */
}

.p-scale {
  font-size: 12px;
  user-select: none;
}
</style>
