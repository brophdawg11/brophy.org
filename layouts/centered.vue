<template>
    <Layout>

        <div class="c-content-centered-outer">

            <div class="c-content-centered">
                <nuxt/>
            </div>

        </div>

    </Layout>
</template>

<script>
import Layout from '../components/Layout.vue';

export default {
    components: {
        Layout,
    },
};
</script>
