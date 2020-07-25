<template>
    <div v-once class="resume">
        <div class="resume__header">
            <div class="resume__headshot">
                <img
                    class="resume__headshot-img"
                    :src="data.headshot"
                    :alt="data.name">
            </div>

            <div class="resume__info">
                <h1 class="resume__name">{{ data.name }}</h1>
                <h2 class="resume__title">{{ data.title }}</h2>
            </div>

            <div class="resume__contact">
                {{ data.location }}<br>
                <a :href="`mailto:${data.email}`" :title="data.email">{{ data.email }}</a><br>
                <nuxt-link to="/">{{ data.website }}</nuxt-link><br>
                <ExternalLink :href="`https://${data.github}`" :title="data.github">
                    {{ data.github }}
                </ExternalLink>
            </div>
        </div>

        <div class="resume__main">

            <ResumeSection title="Key Skills">
                <ul class="resume__skills">
                    <li v-for="skill in data.skills" :key="skill.title">
                        <p class="resume__subtitle">
                            {{ skill.title }}:
                        </p>
                        <p>
                            {{ skill.skills.join(', ') }}
                        </p>
                    </li>
                </ul>
            </ResumeSection>

            <ResumeSection title="Work Experience">
                <ul class="resume__experience">
                    <li v-for="job in data.jobs" :key="job.title">
                        <!-- eslint-disable vue/no-v-html -->
                        <h3 v-html="md(job.title)" />

                        <p v-for="subDetail in job.subDetails"
                           :key="subDetail"
                           class="resume__subtitle"
                           v-html="md(subDetail)" />

                        <ul class="resume__job-details">
                            <li
                                v-for="(detail, idx) in job.details"
                                :key="idx"
                                class="resume__job-details-line"
                                :class="{ 'is-nested': isArray(detail) }">
                                <ul v-if="isArray(detail)" class="resume__job-details-nested">
                                    <li v-for="(detail2, idx2) in detail"
                                        :key="idx2"
                                        class="resume__job-details-line-nested"
                                        v-html="md(detail2)" />
                                </ul>
                                <span v-else v-html="md(detail)" />
                            </li>
                        </ul>
                        <!-- eslint-enable vue/no-v-html -->
                    </li>
                </ul>
            </ResumeSection>

            <ResumeSection title="Education">
                <ul class="resume__education">
                    <li v-for="education in data.education" :key="education.title">
                        <h3>{{ education.title }}</h3>
                        <ul class="resume__education-list">
                            <li v-for="(detail, index) in education.details" :key="index">
                                {{ detail }}
                            </li>
                        </ul>
                    </li>
                </ul>
            </ResumeSection>

        </div>

    </div>
</template>

<script>
import { isArray } from 'lodash-es';
import marked from 'marked';

import ExternalLink from '~/components/ExternalLink.vue';
import ResumeSection from '~/components/ResumeSection.vue';
import data from '~/content/resume-data';

// @todo Custom meta tags?
export default {
    layout: 'centered',
    components: {
        ExternalLink,
        ResumeSection,
    },
    created() {
        this.data = data;
    },
    methods: {
        isArray,
        md(value) {
            try {
                return marked(value).trim().replace(/^<p>|<\/p>$/g, '');
            } catch (e) {
                return value;
            }
        },
    },
};
</script>

<style lang='scss'>
@import '~scss/_variables.scss';

.resume {

    li {
        line-height: 125%;
        padding-bottom: 5px;
    }

    em {
        font-style: italic;
    }

    &__header {
        display: grid;
        grid-template-columns: 1fr;
        border-bottom: 2px solid $orange;
        background: $lightgrey;
        padding: 15px;

        @media (min-width: $medium-min) {
            grid-template-columns: 2fr 10fr 3fr;
        }
    }

    &__headshot {
        display: none;

        @media (min-width: $medium-min) {
            display: block;
        }
    }

    &__headshot-img {
        width: 75%;
        height: auto;
        border-radius: 50%;
    }

    &__info {
        text-align: center;

        @media (min-width: $medium-min) {
            text-align: left;
        }
    }

    &__contact {
        text-align: center;
        line-height: 1.5em;

        @media (min-width: $medium-min) {
            text-align: right;
        }
    }

    &__main {
        padding: 0 0.5em;

        @media (min-width: $medium-min) {
            padding: 0 20px;
        }
    }

    &__subtitle {
        line-height: 1.4em;
        font-size: 0.8em;
        font-style: italic;
        margin-top: 10px;
        color: $darkgrey;
    }

    &__skills {
        list-style-type: none;
        line-height: 1.25em;
    }

    &__experience {
        list-style-type: none;
    }

    &__job-details,
    &__job-details-nested {
        list-style-type: disc;
        list-style-position: outside;
        padding: 5px 0 4px 20px;
    }

    &__job-details-line {
        &.is-nested {
            list-style-type: none;
        }
    }

    &__job-details-nested {
        list-style-type: circle;
    }

    &__education {
        list-style-type: none;
    }

    &__education-list {
        list-style-type: disc;
        list-style-position: outside;
        padding: 5px 0 4px 20px;
    }
}

/* For print, remove background colors and headshot */
@media print {
    html,
    body,
    .resume__header {
        background: white;
        font-size: 95%;
    }

    .resume__header {
        background: inherit;
        padding: 0;
    }

    .resume__headshot {
        display: none;
        margin-right: 0;
    }
}
</style>
