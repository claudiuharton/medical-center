<template>
  <q-page class="flex flex-center column">
    <auth />
  </q-page>
</template>

<style lang="scss"></style>

<script>
import Auth from "../components/Auth.vue";
export default {
  name: "AuthPage",
  components: { Auth }
};
</script>
