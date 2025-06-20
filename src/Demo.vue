<script setup lang="ts">
import PixiRwdContainer from "#/PixiRwdContainer.vue";
</script>
<template>
  <PixiRwdContainer
    :width="500"
    :height="500"
    :appLayout="{
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    }"
    :layout="{
      backgroundColor: '#1099bb',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    }"
    @appResize="
      (...args) => {
        console.log(args);
      }
    "
  >
    <layout-text
      text="12123243"
      :layout="{ width: 200, height: 100, backgroundColor: '#000fff' }"
      :style="{
        fill: '#fff000',
      }"
    />
  </PixiRwdContainer>
</template>
