<template>
    <nav style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb" class="py-2">
        <ol class="breadcrumb">
             <li v-for="(breadcrumb, index) in breadcrumbList" :key="index" :class="{active : breadcrumb.active}" class="breadcrumb-item"><a :href="breadcrumb.link">{{ breadcrumb.name }}</a></li>
        </ol>
    </nav>
</template>

<script>
export default {
    name: 'Beadcrumb',
    data() {
        return {
            breadcrumbList: this.$route.meta.breadcrumb,
        }
    }
}
</script>

<style scoped>
.breadcrumb {
    margin-bottom: 0;
}
</style>