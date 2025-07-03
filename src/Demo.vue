<template>
  <PixiApplication
    :layout="{
      justifyContent: 'center',
      alignItems: 'center',
    }"
    @appResize="
      (...args) => {
        console.log(args);
      }
    "
  >
    <PixiRwdContainer
      :width="500"
      :height="500"
      :layout="{
        backgroundColor: '#1099bb',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }"
    >
      <LayoutText
        text="12123243"
        :layout="{ width: 200, height: 100, backgroundColor: '#000fff' }"
        :style="{
          fill: '#fff000',
        }"
      />
    </PixiRwdContainer>
  </PixiApplication>
</template>
