<template>
  <div class="search">
    <img alt="" class="search-icon" src="~@/assets/imgs/img.magnifying.glass.triangle.down.17_Normal@2x.png" />
    <input class="search-input" :placeholder="'Search Layers'" @blur="queryLayer" @keydown.enter="queryLayer" />
  </div>
</template>

<script setup lang="ts">
import { EditorState } from '~/components/editor-state';

const queryLayer = (e ) => {
  const value = e.target.value;
  const layer = EditorState.shared.selectedPageModel?.queryLayer(value);
  if (layer) {
    EditorState.shared.focusLayer(layer);
    EditorState.shared.selectLayer(layer);
  }
}
</script>
<style scoped>
.search {
  margin-top: 8px;
  margin-left: 8px;
  margin-right: 8px;
  height: 26px;
  border-radius: 4px;
  display: flex;
  padding: 0 8px;
}

.search-icon {
  width: 17px;
  height: 17px;
  align-self: center;
}

.search-input {
  width: 0;
  flex: 1;
  background: none;
  outline: none;
  border: none;
  padding: 0;
  margin-left: 4px;
  margin-bottom: -2px;
  font-size: 12px;
}
</style>
