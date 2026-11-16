<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout name="layout">
    <NuxtPage :transition="{ name: 'notes-slide', mode: 'out-in' }" />
  </NuxtLayout>
</template>
