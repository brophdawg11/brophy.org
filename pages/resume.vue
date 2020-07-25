<template>
    <div v-once id="cv" class="resume">
        <div class="resume__header">
            <div class="resume__headshot">
                <img
                    class="resume__headshot-img"
                    :src="data.headshot"
                    :alt="data.name">
            </div>

            <div class="resume__name">
                <h1>{{ data.name }}</h1>
                <h2>{{ data.title }}</h2>
            </div>

            <div class="resume__contact">
                <ul>
                    <li>{{ data.location }}</li>
                    <li>
                        e:
                        <a :href="`mailto:${data.email}`"
                           :title="data.email">
                            {{ data.email }}
                        </a>
                    </li>
                    <li>
                        w:
                        <nuxt-link to="/">{{ data.website }}</nuxt-link>
                    </li>
                    <li>
                        <ExternalLink :href="`https://${data.github}`"
                                      :title="data.github">
                            {{ data.github }}
                        </ExternalLink>
                    </li>
                </ul>
            </div>

            <div class="resume__clear" />
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
                    <li v-for="job in data.jobs" :key="job.title" class="resume__job">
                        <!-- eslint-disable vue/no-v-html -->
                        <h3 v-html="md(job.title)" />
                        <p v-for="subDetail in job.subDetails"
                           :key="subDetail"
                           class="resume__subtitle"
                           v-html="md(subDetail)" />
                        <ul class="resume__job-details">
                            <li
                                v-for="(detail, index) in job.details"
                                :key="index"
                                :class="{ 'is-nested': isArray(detail) }">
                                <ul v-if="isArray(detail)" :key="index">
                                    <li v-for="detail2 in detail"
                                        :key="detail2"
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
                        <ul>
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

    &__clear {
        clear: both;
        margin-top: 10px;
    }

    &__header {
        border-bottom: 2px solid #cf8a05;
        background: #ededed;
        padding: 15px;
    }

    &__headshot {
        /* TODO: Come back and fix this. Don't include the image for mobile. */
        display: none;

        @media (min-width: $medium-min) {
            display: block;
            width: 80px;
            float: left;
            margin-right: 30px;
        }
    }

    &__headshot-img {
        width: 100%;
        height: auto;
        -webkit-border-radius: 50%;
        border-radius: 50%;
    }

    &__name {
        text-align: center;

        @media (min-width: $medium-min) {
            float: left;
            text-align: left;
        }

        h1 {
            font-size: 1.5em;
            line-height: 125%;
            font-weight: 700;
            font-family: $serif;
            margin-bottom: -6px;

            @media (min-width: $medium-min) {
                font-size: 2.5em;
            }
        }

        h2 {
            font-size: 1.25em;
            line-height: 125%;
            margin-left: 2px;
            font-family: $serif;

            @media (min-width: $medium-min) {
                font-size: 2em;
            }
        }

    }

    &__contact {
        ul {
            list-style-type: none;
            font-size: 0.9em;
            margin-top: 2px;
        }

        li {
            margin-bottom: 3px;
            color: #444;
        }

        @media (min-width: $medium-min) {
            float: right;
            text-align: left;
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
        margin-bottom: 0;
        color: #444;
    }

    &__skills {
        list-style-type: none;
        line-height: 1.25em;
    }

    &__experience {
        list-style-type: none;
    }

    &__job {

    }

    &__job-details {
        list-style-type: disc;
        list-style-position: outside;
        padding: 5px 0 4px 20px;

        ul {
            list-style-type: disc;
            list-style-position: outside;
            padding: 5px 0 4px 20px;
        }

        li {
            &.is-nested {
                list-style-type: none;

                ul {
                    list-style-type: circle;
                }
            }
        }

        em {
            font-style: italic;
        }
    }

    &__education {
        list-style-type: none;

        ul {
            list-style-type: disc;
            list-style-position: outside;
            padding: 5px 0 4px 20px;
        }
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

    .resume__contact {
        text-align: center;
    }
}
</style>
