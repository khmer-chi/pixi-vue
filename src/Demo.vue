<script setup lang="ts">
import { ref } from "vue";
const width = ref(500);
const text = ref("12122322s211");

const angle = ref(90);
setTimeout(() => {
  angle.value = 180;
}, 1000);
</script>
<template>
  <PixiApplication
    ref="app"
    :width
    :height="500"
    :layout="{
      backgroundColor: '#1099bb',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    }"
  >
    <PixiLayoutText
      :angle
      :text
      :layout="{ width: 250, height: 250, backgroundColor: '#000fff' }"
      :style="{
        fill: '#fff000',
      }"
    />
  </PixiApplication>
</template>
