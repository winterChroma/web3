<template>
        <div :style="image" class="image"></div>
</template>

<script>
    export default {
        name: 'Landing Page',
        data() {
            return {
                image: {backgroundImage: "url(../assets/grass_image.png)"}
            };
        }
    };
</script>