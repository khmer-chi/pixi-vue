<template>
  <PixiApplication
    :width="500"
    :height="500"
    :layout="{
      backgroundColor: '#1099bb',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    }"
    @appResize="
      (...args) => {
        //console.log(args);
      }
    "
  >
    <!-- <PixiContainer :layout="{ width: 200, height: 200 }"></PixiContainer> -->
    <!-- <LayoutContainer
      :layout="{ width: 200, height: 200, backgroundColor: '#000fff' }"
    ></LayoutContainer> -->
    <LayoutText
      text="12123243"
      :layout="{ width: 250, height: 250, backgroundColor: '#000fff' }"
      :style="{
        fill: '#fff000',
      }"
    />

    <LayoutText
      text="12123243"
      :layout="{ width: 250, height: 250, backgroundColor: '#000fff' }"
      :style="{
        fill: '#fff000',
      }"
    />
  </PixiApplication>
</template>
