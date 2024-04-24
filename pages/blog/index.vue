<template>
    <div>
        <p>this is the email: {{ userEmail }}</p>
    </div>
</template>

<script>
export default {
  setup () {
    const userEmail = ref('');

    onMounted(() => {
      userEmail.value = localStorage.getItem('email') || '';
    });

    return { userEmail };
  },
}
</script>


<style lang="scss" scoped>

</style>