/**
 * The contextual link system for the corporate and group pages. Each page picks the few
 * experiences that are the natural next step for its reader, so the cluster links to itself
 * without putting any of it in the primary nav. The card style is the one the team building
 * page already used for its related section.
 */

export type ExperienceHref =
  | "/mahjong-corporate-las-vegas"
  | "/corporate-event-activities-las-vegas"
  | "/corporate-team-building-las-vegas"
  | "/las-vegas-meeting-planner-activities"
  | "/conference-activities-las-vegas"
  | "/convention-activities-las-vegas"
  | "/trade-show-booth-activities-las-vegas"
  | "/incentive-group-activities-las-vegas"
  | "/play-mahjong-las-vegas";

const EXPERIENCES: Record<ExperienceHref, { title: string; blurb: string }> = {
  "/mahjong-corporate-las-vegas": {
    title: "Corporate Mahjong Events",
    blurb: "How we run events for companies: what we bring, what you provide, and how to get a quote.",
  },
  "/corporate-event-activities-las-vegas": {
    title: "Corporate Event Activities",
    blurb: "Employee appreciation, client nights, sales meetings, retreats and holiday parties, with the format that suits each.",
  },
  "/corporate-team-building-las-vegas": {
    title: "Corporate Team Building",
    blurb: "A strategic, social session for teams, departments and offsites, taught from zero.",
  },
  "/las-vegas-meeting-planner-activities": {
    title: "Meeting Planner Activities",
    blurb: "Icebreakers, breakouts and evening socials, matched to the slot you need to fill in your agenda.",
  },
  "/conference-activities-las-vegas": {
    title: "Conference Activities",
    blurb: "Networking breaks, receptions and breakouts that run in your hotel meeting room.",
  },
  "/convention-activities-las-vegas": {
    title: "Convention Activities",
    blurb: "Attendee engagement sessions and group downtime for convention groups of any size.",
  },
  "/trade-show-booth-activities-las-vegas": {
    title: "Trade Show Booth Activities",
    blurb: "A live game at your booth or in your hospitality suite, for exhibitors and sponsors.",
  },
  "/incentive-group-activities-las-vegas": {
    title: "Incentive Group Activities",
    blurb: "A hosted experience for reward trips and visiting groups, set up at the group's hotel.",
  },
  "/play-mahjong-las-vegas": {
    title: "Play While You Visit",
    blurb: "Already play American Mahjong? Book a seat at Social Open Play at our studio during your trip.",
  },
};

interface RelatedExperiencesProps {
  label?: string;
  heading: string;
  accent: string;
  links: ExperienceHref[];
  background?: string;
  maxWidth?: string;
}

export default function RelatedExperiences({ label = "Related Experiences", heading, accent, links, background = "var(--navy)", maxWidth = "980px" }: RelatedExperiencesProps) {
  return (
    <section style={{ padding: "5rem 2rem", background }}>
      <div className="container" style={{ maxWidth }}>
        <p className="section-label">{label}</p>
        <h2 className="section-title">
          {heading} <span className="accent-pink">{accent}</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
          {links.map((href) => (
            <a key={href} href={href} style={{ display: "block", textDecoration: "none", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
              <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--green)" }}>{EXPERIENCES[href].title}</h3>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>{EXPERIENCES[href].blurb}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
