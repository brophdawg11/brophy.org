<template>
    <div v-once id="cv">
        <div class="mainDetails">
            <div class="headshot">
                <img :src="resumeData.headshot" :alt="resumeData.name">
            </div>

            <div class="name">
                <h1>{{ resumeData.name }}</h1>
                <h2>{{ resumeData.title }}</h2>
            </div>

            <div class="contactDetails">
                <ul>
                    <li>{{ resumeData.location }}</li>
                    <li>
                        e:
                        <a :href="`mailto:${resumeData.email}`"
                           :title="resumeData.email">
                            {{ resumeData.email }}
                        </a>
                    </li>
                    <li>
                        w:
                        <nuxt-link to="/">{{ resumeData.website }}</nuxt-link>
                    </li>
                    <li>
                        <ExternalLink :href="`https://${resumeData.github}`"
                                      :title="resumeData.github">
                            {{ resumeData.github }}
                        </ExternalLink>
                    </li>
                </ul>
            </div>

            <div class="clear" />
        </div>

        <div id="mainArea">

            <section class="keySkillsSection">
                <div class="sectionTitle">
                    <h1>Key Skills</h1>
                </div>

                <div class="sectionContent">
                    <template v-for="keySkill in resumeData.keySkills">
                        <p :key="`${keySkill.title}-title`" class="subDetails">
                            {{ keySkill.title }}:
                        </p>
                        <ul :key="`${keySkill.title}-list`" class="keySkills">
                            <li
                                v-for="skill in keySkill.skills"
                                :key="skill"
                                v-text="skill" />
                        </ul>
                    </template>
                </div>

                <div class="clear" />
            </section>

            <section class="workDetails">
                <div class="sectionTitle">
                    <h1>Work Experience</h1>
                </div>

                <div class="sectionContent">

                    <article v-for="job in resumeData.jobs" :key="job.title">
                        <!-- eslint-disable vue/no-v-html -->
                        <h2 v-html="md(job.title)" />
                        <p v-for="subDetail in job.subDetails"
                           :key="subDetail"
                           class="subDetails"
                           v-html="md(subDetail)" />
                        <ul class="workDetails-list">
                            <template v-for="(detail, index) in job.details">
                                <ul v-if="isArray(detail)" :key="index">
                                    <li v-for="detail2 in detail"
                                        :key="detail2"
                                        v-html="md(detail2)" />
                                </ul>
                                <li v-else
                                    :key="detail"
                                    v-html="md(detail)" />
                            </template>
                        </ul>
                        <!-- eslint-enable vue/no-v-html -->
                    </article>

                </div>
                <div class="clear" />
            </section>

            <section>
                <div class="sectionTitle">
                    <h1>Education</h1>
                </div>

                <div class="sectionContent">
                    <article v-for="education in resumeData.education"
                             :key="education.title">
                        <h2>{{ education.title }}</h2>
                        <p v-for="(detail, index) in education.details"
                           :key="index"
                           class="subDetails">
                            {{ detail }}
                        </p>
                    </article>
                </div>

                <div class="clear" />
            </section>

        </div>

    </div>
</template>

<script>
import { isArray } from 'lodash-es';
import marked from 'marked';

import ExternalLink from '~/components/ExternalLink.vue';
import resumeData from '~/content/resume-data';

// @todo Custom meta tags?
export default {
    layout: 'centered',
    components: {
        ExternalLink,
    },
    created() {
        this.resumeData = resumeData;
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

#cv {

    ////// Old resume styles
    .clear {
        clear: both;
        margin-top: 10px;
    }

    .bold { font-weight: bold; }

    .italics { font-style: italic; }

    p {
        font-size: 1em;
        line-height: 1.4em;
        color: #444;
    }

    li {
        line-height: 125%;
        padding-bottom: 5px;
    }

    .headshot {
        /* TODO: Come back and fix this. Don't include the image for mobile. */
        display: none;
    }

    .mainDetails {
        border-bottom: 2px solid #cf8a05;
        background: #ededed;
        padding: 15px;
    }

    #mainArea {
        padding: 0.5em;

        @media all and (min-width: $medium-min) {
            padding: 1%;
        }
    }

    .name,
    .contactDetails {
        text-align: center;
    }

    .name h1 {
        font-size: 1.5em;
        line-height: 125%;
        font-weight: 700;
        font-family: $serif;
        margin-bottom: -6px;
    }

    .name h2 {
        font-size: 1.25em;
        line-height: 125%;
        margin-left: 2px;
        font-family: $serif;
    }

    .contactDetails ul {
        list-style-type: none;
        font-size: 0.9em;
        margin-top: 2px;
    }

    .contactDetails ul li {
        margin-bottom: 3px;
        color: #444;
    }

    section {
        border-top: 1px solid #dedede;
        padding: 10px 0;
    }

    section:first-child {
        border-top: 0;
    }

    section:last-child {
        padding-bottom: 10px;
    }

    .sectionTitle,
    .sectionContent {
        float: none;
        width: 100%;
    }

    .sectionTitle {
        font-size: 1.25em;
    }

    .sectionTitle h1 {
        font-family: $serif;
        font-style: italic;
        font-size: 1.5em;
        color: #c58405;
    }

    .sectionContent {
        margin-left: 5px;
    }

    .sectionContent article {
        margin-top: 15px;
        margin-right: 10px;
    }

    .sectionContent h2 {
        font-family: $serif;
        font-size: 1.5em;
    }

    .subDetails {
        font-size: 0.8em;
        font-style: italic;
        margin-bottom: 0;
    }

    .workDetails .sectionContent ul {
        padding: 5px 0 4px 20px;
    }

    .workDetails-list {
        list-style-type: disc;
        list-style-position: outside;

        em {
            font-style: italic;
        }
    }

    .keySkills + .subDetails {
        padding-top: 10px;
    }

    .keySkills {
        list-style-type: none;
        -moz-column-count: 2;
        -webkit-column-count: 2;
        column-count: 2;
        font-size: 1em;
        color: #444;
    }

    .keySkills.large {
        -moz-column-count: 1;
        -webkit-column-count: 1;
        column-count: 1;
    }

    .keySkills:last-child {
        margin-bottom: 5%;
    }

    /* Add a third column, and some external padding */
    @media all and (min-width: 480px) {
        .keySkills {
            -moz-column-count: 3;
            -webkit-column-count: 3;
            column-count: 3;
        }
    }

    /* Transform the columns into comma separated lists */
    @media all and (min-width: 600px), print {
        .name h1 {
            font-size: 2.5em;
        }

        .name h2 {
            font-size: 2em;
        }

        .keySkills,
        .keySkills.large {
            display: inline;
            list-style: none;
            padding-bottom: 10px;
        }

        .keySkills li,
        .keySkills.large li {
            display: inline;
        }

        .keySkills li:after,
        .keySkills.large li:after {
            content: ", ";
        }

        .keySkills li:last-child:after,
        .keySkills.large li:last-child:after {
            content: '';
        }

        .keySkills:last-child {
            margin-bottom: 30px;
        }
    }

    /* Show the headshot */
    @media screen and (min-width: 700px), print {
        .name {
            float: left;
            text-align: left;
        }

        .contactDetails {
            float: right;
            text-align: left;
        }

        .headshot {
            display: block;
            width: 80px;
            float: left;
            margin-right: 30px;
        }

        .headshot img {
            width: 100%;
            height: auto;
            -webkit-border-radius: 50%;
            border-radius: 50%;
        }
    }

    /* For print, remove background colors and headshot */
    @media print {
        html,
        body,
        #cv,
        .mainDetails {
            background: white;
            font-size: 95%;
        }

        .mainDetails {
            background: inherit;
            padding: 0;
        }

        .headshot {
            display: none;
            margin-right: 0;
        }

        .noprint {
            display: none;
        }
    }

    /* Move the headers to the left column, and cap the max width of the content */
    @media all and (min-width: 800px) {

        .sectionTitle {
            float: left;
            width: 25%;
        }

        .sectionContent {
            float: right;
            width: 72.5%;
        }

        .sectionContent article:first-child {
            margin-top: 5px;
        }

        .keySkillsSection p:first-child {
            margin-top: 10px;
        }
    }
}

</style>
