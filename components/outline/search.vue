<template>
  <div class="search">
    <img alt="" class="search-icon" src="~@/assets/imgs/img.magnifying.glass.triangle.down.17_Normal@2x.png" />
    <input class="search-input" :placeholder="'Search Layers'" />
  </div>
</template>

<script setup lang="ts"></script>
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
