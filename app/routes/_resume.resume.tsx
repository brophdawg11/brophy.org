import { Link } from 'react-router';
import type { ReactElement } from 'react';

import type { Route } from './+types/_resume.resume';
import ExternalLink from '~/components/ExternalLink';
import type { ResumeData } from '~/ts/resume';
import resumeData from '~/ts/resume';

import '~/styles/resume.css';
import { md } from '~/ts/marked.server';

export function meta({ matches }: Route.MetaArgs) {
  const rootMatchMeta = matches[0].meta;
  return [
    ...rootMatchMeta.filter(
      (m) => !('title' in m) && 'name' in m && m.name !== 'description',
    ),
    { title: "Matt Brophy's Resume" },
    { name: 'description', content: "Matt Brophy's Resume" },
  ];
}

export async function loader() {
  const enhancedData: ResumeData = {
    ...resumeData,
    jobs: resumeData.jobs.map((j) => ({
      title: mdTrim(j.title),
      details: j.details.map((d) =>
        Array.isArray(d) ? d.map((d2) => mdTrim(d2)) : mdTrim(d),
      ),
      subDetails: j.subDetails.map((sd) => mdTrim(sd)),
    })),
  };
  return { resumeData: enhancedData };
}

interface ResumeSectionProps {
  title: string;
  children: ReactElement;
}

function ResumeSection({ children, title }: ResumeSectionProps) {
  return (
    <section className="resume-section">
      <h2 className="resume-section__title">{title}</h2>
      <div className="resume-section__content">{children}</div>
    </section>
  );
}

interface ResumeHelperProps {
  data: ResumeData;
}

function ResumeHeader({ data }: ResumeHelperProps) {
  return (
    <div className="resume__header">
      <div className="resume__headshot">
        <img
          className="resume__headshot-img"
          src={data.headshot}
          alt={data.name}
        />
      </div>

      <div className="resume__info">
        <h1 className="resume__name">{data.name}</h1>
        <h2 className="resume__title">{data.title}</h2>
      </div>

      <div className="resume__contact">
        {data.location}
        <br />
        <a href={`mailto:${data.email}`} title={data.email}>
          {data.email}
        </a>
        <br />
        <Link to="/">{data.website}</Link>
        <br />
        <ExternalLink to={`https://${data.github}`} title={data.github}>
          {data.github}
        </ExternalLink>
      </div>
    </div>
  );
}

function ResumeSkills({ data }: ResumeHelperProps) {
  return (
    <ResumeSection title="Key Skills">
      <ul className="resume__skills">
        {data.skills.map((skill) => (
          <li key={skill.title}>
            <p className="resume__subtitle">{skill.title}:</p>
            <p>{skill.skills.join(', ')}</p>
          </li>
        ))}
      </ul>
    </ResumeSection>
  );
}

function ResumeJobDetail({ detail }: { detail: string | string[] }) {
  return (
    <li
      className={`resume__job-details-line ${
        Array.isArray(detail) ? 'is-nested' : ''
      }`}>
      {Array.isArray(detail) ? (
        <ul className="resume__job-details-nested">
          {detail.map((detail2, idx) => (
            <li
              key={idx}
              className="resume__job-details-line-nested"
              dangerouslySetInnerHTML={{
                __html: detail2,
              }}
            />
          ))}
        </ul>
      ) : (
        <span
          dangerouslySetInnerHTML={{
            __html: detail,
          }}
        />
      )}
    </li>
  );
}

function ResumeJobs({ data }: ResumeHelperProps) {
  return (
    <ResumeSection title="Work Experience">
      <ul className="resume__experience">
        {data.jobs.map((job) => (
          <li key={job.title}>
            <h3 dangerouslySetInnerHTML={{ __html: job.title }} />

            {job.subDetails.map((subDetail) => (
              <p
                key={subDetail}
                className="resume__subtitle"
                dangerouslySetInnerHTML={{ __html: subDetail }}
              />
            ))}

            <ul className="resume__job-details">
              {job.details.map((detail, idx) => (
                <ResumeJobDetail detail={detail} key={idx} />
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </ResumeSection>
  );
}

function ResumeEducation({ data }: ResumeHelperProps) {
  return (
    <ResumeSection title="Education">
      <ul className="resume__education">
        {data.education.map((education) => (
          <li key={education.title}>
            <h3>{education.title}</h3>
            <ul className="resume__education-list">
              {education.details.map((detail, idx) => (
                <li key={idx}>{detail}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </ResumeSection>
  );
}

export default function Resume({ loaderData }: Route.ComponentProps) {
  const { resumeData: data } = loaderData;
  return (
    <div className="content-centered">
      <div className="resume">
        <ResumeHeader data={data} />
        <div className="resume__main">
          <ResumeSkills data={data} />
          <ResumeJobs data={data} />
          <ResumeEducation data={data} />
        </div>
      </div>
    </div>
  );
}

function mdTrim(str: string) {
  return md(str)
    .trim()
    .replace(/^<p>|<\/p>$/g, '');
}
