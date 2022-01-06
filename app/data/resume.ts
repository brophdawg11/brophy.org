/* eslint-disable max-len */

export type ResumeData = {
    name: string;
    title: string;
    headshot: string;
    location: string;
    email: string;
    website: string;
    github: string;

    skills: {
        title: string;
        skills: string[];
    }[];

    jobs: {
        title: string;
        subDetails: string[];
        details: (string | string[])[];
    }[];

    education: {
        title: string;
        details: string[];
    }[];
};

const resumeData: ResumeData = {
    name: 'Matt Brophy',
    title: 'Web/Software Developer',
    headshot: '/images/headshot.jpg',
    location: 'Philadelphia, PA',
    email: 'matt@brophy.org',
    website: 'www.brophy.org',
    github: 'github.com/brophdawg11',

    skills: [
        {
            title: 'Web Languages',
            skills: [
                'JavaScript',
                'HTML',
                'CSS',
                'SCSS',
                'Less',
                'JSON',
                'XML',
            ],
        },
        {
            title: 'Web Technologies',
            skills: [
                'Vue',
                'Vuex',
                'Express',
                'Webpack',
                'Axios',
                'Jest',
                'Gulp',
                'Storybook',
            ],
        },
        {
            title: 'Cloud/CI Technologies',
            skills: [
                'Netlify',
                'Github Actions',
                'Jenkins',
                'AWS (S3, Cloudfront, Route 53, EC2)',
                'Travis CI',
            ],
        },
        {
            title: 'Databases',
            skills: ['Redis', 'MongoDB', 'MySQL', 'PostgreSQL'],
        },
        {
            title: 'Other',
            skills: [
                'OSX/*nix',
                'Git',
                'Bash',
                'Python',
                'Java',
                'C#',
                'Agile (Scrum)',
            ],
        },
    ],

    jobs: [
        {
            title: "Web Architect - [URBN](http://www.urbn.com/ 'URBN')",
            subDetails: ['February 2015 - Present'],
            details: [
                'Front End Web Architect _(August 2018 - Present)_',
                [
                    'Leading the architecture and development of the next-generation multi-tenant e-commerce application',
                    'Created and maintaining a [custom Vue SSR platform](https://github.com/brophdawg11/vue-ssr-build)',
                    'Custom universal REST client wrapping axios to handle all internal API calls including token management',
                    'Instituting performance best practices including automated performance budgets and lighthouse testing',
                    'Overseeing incremental migration from the prior application on a route-by-route basis',
                    'Developed and overseeing the development and CI pipeline using Docker, Jenkins2, and Github Actions',
                    'Managing ongoing development using feature flags to avoid long-lived feature branches',
                    'Complex UI flows implemented with [state machines](https://github.com/brophdawg11/state-machine)',
                    'Technologies: vue, vue-router, vuex, vue-server-renderer, vue-i18n, express, webpack, lodash-es, docker, jenkins2, github actions',
                ],
                'Front End Web Architect _(October 2017 - August 2018)_',
                [
                    'Served as the architect for the front end web group, consisting of 4 teams of 4-5 developers',
                    'Focused on big-picture initiatives, evolution of the e-commerce application, performance, and best practices',
                    'Retrofitted existing application with webpack dynamic import patterns to improve application performance',
                    'Consolidated 6 individual git repositories into a single monolithic repository for the e-commerce front-end',
                    'Technologies: python, tornado, redux, redux sagas, gulp, webpack, lodash, docker, jenkins2',
                ],
                'Senior Web Engineer - Unified Cart Checkout Application _(February 2015 - October 2017)_',
                [
                    'Lead Architect and Developer for a multi-tenant Angular.js application providing the URBN brand Cart/Checkout E-Commerce experience',
                    'Heavily asynchronous SPA leveraging RESTful micro services',
                    'Leveraged Angular providers and decorators to provide brand-customizable experiences from a single codebase',
                    'Leveraged ui-router views to incorporate portions of non-Angular browsing applications into the Angular application to improve code-reuse and provide a consistent look and feel throughout',
                    'Internationalized application to run in multiple languages',
                    'Heavy use of Angular interceptors to manage app-wide API request logic, including detecting failed requests, adjusting where possible, and retrying originating requests',
                    'Gulp-based build process used to provide branded builds',
                    "Launched [freepeople.com](http://www.freepeople.com 'freepeople.com') in April 2016",
                    "Launched [anthropologie.com](http://www.anthropologie.com 'anthropologie.com') in October 2016",
                    "Planned launch for [urbanoutfitters.com](http://www.urbanoutfitters.com 'urbanoutfitters.com') in Q1 2017",
                    'Technologies: Angular, ui-router, LoDash, Hapi, Foundation, SCSS, Gulp, Karma, Jasmine',
                ],
            ],
        },
        {
            title: 'Senior Web/Mobile Developer - [Judge Consulting Group](https://www.judge.com/)',
            subDetails: [
                'January 2012 - February 2013',
                'February 2014 - February 2015',
            ],
            details: [
                "Lockheed Martin 'Build Your Own Littoral Combat Ship' iPad application",
                [
                    'Developed a Hybrid PhoneGap application to assist sales personnel in presenting varying models of Littoral Combat Ships to potential buyers',
                    'Implemented a real-time ship overview of selected options, with the ability to zoom in on portions of the ship by dragging a finger across the overview',
                    'Implemented click-tracking analytics and graphing capabilities for retrospective analysis of popular ship options',
                    'Technologies: Angular, Bootstrap, LoDash, Chart.js, Less, lscache, Karma, Jasmine',
                ],

                'GlaxoSmithKline Field Communications Center POC',
                [
                    'Developed a Hybrid PhoneGap application to provide corporate article access to field personnel',
                    'Provided caching ability in WebSQL for offline article reading',
                    'Integrated with native iOS calendar to allow creation of follow up reminder alerts for articles',
                    'Integrated with GSK corporate OAuth login endpoint',
                    'Technologies: jQuery, jQuery Mobile, LoDash, Handlebars, Less, WebSQL, QUnit, Gulp',
                ],

                "[The Judge Group](http://www.judge.com 'The Judge Group') Corporate Website redesign",
                [
                    'Responsible for all .NET MVC Web application and front-end HTML/CSS/JavaScript development for the redesigned Judge Group corporate website',
                    'Leveraged mobile-first responsive web design techniques to support all mobile and tablet device resolutions',
                    'Implemented a Sharepoint-backed Widget-based site design that can be controlled and modified by content managers',
                    'Integrated with LinkedIn, Dropbox, and Google Drive APIs to upload resume information',
                    'Technologies: .NET MVC, jQuery, Bootstrap, LoDash, Razor templates, Less',
                ],

                'PAR Assessment Toolkit iOS/Android Application',
                [
                    'Developed a Hybrid PhoneGap application to assist Psychological professionals, aimed to replace the existing native iOS and Android applications',
                    'Leveraged mobile-first responsive web design techniques to support all mobile and tablet device resolutions',
                    'Implemented AJAX localStorage caching mechanism to reduce call traffic to server endpoints',
                    'Technologies: jQuery, jQuery Mobile, LoDash, Handlebars, Less, Flotr2, lscache, QUnit, Gulp',
                ],

                'GlaxoSmithKline GPO Rebate Calculator iPad Application',
                [
                    'Developed an iPad application to assist in calculation of available and earned rebates for bulk pharmaceutical purchases',
                    'Developed a HTML5 web application to run within the native Skura hybrid wrapper',
                    'Technologies: Zepto, LoDash, Knockout, Hammer, Less, FTScroller, QUnit, Gulp',
                ],

                'UK Parliament MyConstituency iOS/Android Application',
                [
                    'Performed additional application development and maintenance on existing PhoneGap Hybrid application',
                    'Implemented a stremlined build process using Gulp',
                    'Modularized and refactored JavaScript application code resulting in a close to a 40% reduction in lines of code',
                    'Technologies: jQuery, LoDash, Leaflet, Kendo',
                ],

                "BNP Paribas [hellotrends.be](http://www.hellotrends.be 'hellotrends.be') website",
                [
                    'Developed a multi-lingual responsive website for displaying new articles and blog entries in the banking industry',
                    'Implemented a personalization algorithm based on article categories and tags that allows the user to opt-in to a personalized sorting of articles',
                    'Runs on top of a Sitefinity CMS instance',
                    'Handled cross-browser issues to ensure proper site execution in IE8',
                    'Technologies: jQuery, LoDash, Hammer, Handlebars',
                ],
            ],
        },
        {
            title: 'JavaScript Developer - [EPAM Empathy Lab](https://www.epam.com/)',
            subDetails: ['February 2013 - February 2014'],
            details: [
                'DAWN Set Top Box UI',
                [
                    'Served as a lead developer on a team of 15+ developers, building a JavaScript/HTML5/CSS3 user interface running in an embedded QT WebKit browser on a Linux-based set top cable box',
                    'Designed and implemented main routing, view life-cycle, and event handler modules in an 80k-line JavaScript application',
                    'Diagnosed and addressed various animation performance issues due to the hardware limitations of the set top box.  Heavy use of requestAnimationFrame() and ensuring JavaScript was not running at the same time as animations ensured smooth visual effects',
                    'Diagnosed and addressed various memory leaks via heavy use of Chrome DevTools and other memory management tools',
                    'Primarily used native, heavily-asynchronous Javascript, along with libraries/frameworks such as jQuery Deferred, LoDash, Director.js, Backbone, and Duster.js',
                ],

                'Brite WebRTC Video Chat Application',
                [
                    'Finished in 1st place out of 8 teams in the EPAM North American Hackathon',
                    "Given 12 hours to build something from scratch to help the global EPAM corporation to 'Follow the Sun,' our 3-man team built a browser-based WebRTC video/audio/text chat application to faciliate communication amongst global development teams",
                    'Demo available at [getbrite.info](http://www.getbrite.info) (Only tested in Chrome)',
                    'The same team will be traveling to Minsk, Belarus in January 2014 to compete in a 24-hour EPAM Global Hackathon against other regional winners',
                ],
            ],
        },
        {
            title: 'Expert Consultant - Software Rights Archive, LLC. vs. Google Inc. et al',
            subDetails: ['May 2009 - August 2009', 'May 2010 - January 2012'],
            details: [
                'Reviewed source code and documentation related to system architecture and algorithms of search engines owned by Google, Yahoo! and IAC (Ask.com) to evaluate patent infringement claims',
                'Consulted with legal counsel regarding crawl-to-query pipeline including key algorithms and system interfaces',
                'Guided legal counsel through source code level depositions with software engineers',
            ],
        },
        {
            title: "CSE Master's Degree Candidate - Lehigh University",
            subDetails: ['August 2008 - May 2010'],
            details: [
                'Thesis: OWL-PL: A Presentation Language for Displaying Semantic Data on the Web',
                'Independently developed a database-driven web application to facilitate the hiring process for new CSE faculty members using the Java Stripes web framework',
                'Additional areas of study included Semantic Web, WWW Search, Web Applications, Pattern Recognition, Parallel Computing, and Robotics',
            ],
        },
        {
            title: 'Web Programmer - [Software Consulting Services](https://www.newspapersystems.com/)',
            subDetails: ['January 2008 - January 2010'],
            details: [
                'Worked in an agile Scrum environment developing web-based modules to interface with backend applications in the newspaper industry.',
                'Used technologies including generative programming and frame-based macro preprocessing.',
            ],
        },
        {
            title: "Web Programmer, System Admin - [brophy.org](https://www.brophy.org 'www.brophy.org')",
            subDetails: ['2002 - Present'],
            details: [
                'Installed, configured, and currently maintaining various Web sites, hosted at sub domains of brophy.org',
                "Currently a static site generated with [Nuxt](https://nuxtjs.org/ 'Nuxt') and hosted in AWS S3",
                "Previously hosted in personal Linux server hardware and Amazon's EC2 infrastructure",
                'Mail currently hosted via Google Apps',
                'Integrated with Google calendar',
            ],
        },
        {
            title: 'Web Programmer - victorypicks.com',
            subDetails: ['February 2007 - February 2008'],
            details: [
                'Developed and maintained a commercial, database driven web application:',
                [
                    'Built on the LAMP (Linux, Apache, MySQL, PHP) architecture',
                    'Extensive use of AJAX, XML, JavaScript, DHTML, CSS, PHP, and SQL',
                    'Interfaced with PayPal to accept electronic payments',
                    'Included separate, restricted member and administrator only access zones',
                ],
                'Served as the DB admin, DB programmer, front and back-end web programmer',
            ],
        },
        {
            title: 'IT Advisory Associate - KPMG LLP',
            subDetails: ['September 2006 - January 2008'],
            details: [
                'Assisted in planning, execution, and documentation of IT audit and attestation engagements',
                'Led small teams in client engagements, as well as executed individual engagements',
            ],
        },
        {
            title: 'Junior System Administrator - Lehigh University CSE Department',
            subDetails: ['January 2003 - May 2006'],
            details: [
                'Installed hardware and software in department machines, working in UNIX/Linux/Windows environments',
                'Programmed various system administrative functions, including an automated password cracking program to detect and alert users of weak passwords',
            ],
        },
        {
            title: 'Integrated Product Development Program - Lehigh University',
            subDetails: ['Spring/Fall 2005'],
            details: [
                'Programmed a custom Excel add-on in VBA to perform a regression analysis on data extracted from a MS SQL Server database and graph the results for an engineering firm in Harrisburg, PA',
            ],
        },
        {
            title: 'WUME (Web Usage Methodology and Evaluation) Laboratory - Lehigh University',
            subDetails: ['Fall 2002'],
            details: [
                'Assisted in the research and programming for the [Finding Relevant Website Queries](http://www.cse.lehigh.edu/~brian/pubs/2003/www/) paper published at the 12th International World Wide Web Conference',
            ],
        },
    ],

    education: [
        {
            title: 'Lehigh University (2010)',
            details: [
                'College of Engineering and Applied Science',
                'Master of Science, Computer Science and Engineering, May 2010, GPA: 4.0/4.0',
            ],
        },
        {
            title: 'Lehigh University (2006)',
            details: [
                'College of Engineering and Applied Science/College of Business and Economics',
                'Bachelor of Science, Computer Science and Business, May 2006, GPA: 3.32/4.0',
                "Honors: Phi Eta Sigma Honor Fraternity, National Society of Collegiate Scholars, The National Dean's List",
            ],
        },
    ],
};

export default resumeData;
