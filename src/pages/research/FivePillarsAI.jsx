import NotebookLayout from '../../components/research/NotebookLayout'
import TextCell from '../../components/research/cells/TextCell'
import CodeCell from '../../components/research/cells/CodeCell'
import ChartCell from '../../components/research/cells/ChartCell'
import InsightCell from '../../components/research/cells/InsightCell'
import ImageCell from '../../components/research/cells/ImageCell'

const TOC = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'five-pillars', label: 'The five pillars' },
  { id: 'readiness',    label: 'Readiness scoring' },
  { id: 'pillar-one',   label: 'Pillar 1 — Leadership' },
  { id: 'research-note',label: 'Research note' },
]

export default function FivePillarsAI() {
  return (
    <NotebookLayout
      title="Five Pillars for Winning Together in the Age of AI"
      subtitle="A strategic research debrief"
      date="April 2026"
      status="in-progress"
      tags={['AI Strategy', 'Enterprise', 'Leadership', 'Workforce Transformation']}
      toc={TOC}
    >
      <TextCell id="introduction" heading="Introduction" dropCap>
        <p>
          The rapid acceleration of AI capabilities is reshaping every industry. But technology alone
          doesn't determine winners — the organizations that thrive will be those that align people,
          processes, and strategy around AI as a collaborative force multiplier.
        </p>
        <p>
          This research debrief identifies five foundational pillars that organizations must embrace
          to win together in this new era. Each pillar is backed by data, real-world case studies,
          and actionable frameworks.
        </p>
      </TextCell>

      <InsightCell>
        Organizations that treat AI as a tool to augment human capability — rather than replace it — see
        3× higher adoption rates and measurably better outcomes across productivity, retention, and innovation.
      </InsightCell>

      <TextCell id="five-pillars" heading="The five pillars">
        <p>
          Through analysis of enterprise AI deployments across multiple industries, five recurring
          patterns emerge among the most successful implementations:
        </p>
        <ol className="list-decimal list-outside pl-5 space-y-2">
          <li><strong className="text-text">Leadership alignment</strong> — executive sponsorship with a clear AI vision</li>
          <li><strong className="text-text">Workforce transformation</strong> — upskilling and role evolution, not displacement</li>
          <li><strong className="text-text">Ethical frameworks</strong> — governance, bias mitigation, and trust</li>
          <li><strong className="text-text">Technical infrastructure</strong> — scalable, production-grade AI systems</li>
          <li><strong className="text-text">Ecosystem strategy</strong> — partnerships, platforms, and shared value creation</li>
        </ol>
      </TextCell>

      <ChartCell title="AI adoption vs. organizational readiness" />

      <TextCell id="readiness" heading="Readiness scoring">
        <p>
          A weighted readiness score makes pillar gaps visible before they become execution risk.
          The framework below is deliberately simple — the hard part is honest self-assessment
          of each pillar's current state.
        </p>
      </TextCell>

      <CodeCell language="python">
{`# Pillar readiness scoring framework
def calculate_readiness_score(organization):
    pillars = {
        'leadership_alignment':     assess_leadership(organization),
        'workforce_transformation': assess_workforce(organization),
        'ethical_frameworks':       assess_ethics(organization),
        'technical_infrastructure': assess_infrastructure(organization),
        'ecosystem_strategy':       assess_ecosystem(organization),
    }

    weights = [0.25, 0.20, 0.15, 0.25, 0.15]
    scores  = list(pillars.values())

    return sum(w * s for w, s in zip(weights, scores))`}
      </CodeCell>

      <ImageCell caption="Figure 1 — Five pillars framework diagram" />

      <TextCell id="pillar-one" heading="Pillar 1 — Leadership alignment">
        <p>
          The single strongest predictor of successful AI adoption is executive alignment. Organizations
          where C-suite leaders articulate a clear, shared vision for AI — and back it with sustained
          investment — consistently outperform those with fragmented or bottom-up approaches.
        </p>
        <p>
          This section will explore the leadership patterns observed across high-performing AI organizations,
          including case studies from pharmaceutical, automotive, and technology sectors.
        </p>
      </TextCell>

      <InsightCell label="Research note">
        <span id="research-note" />
        This research is actively in progress. Additional pillars, data visualizations, and case studies
        will be added as the analysis develops. Check back for updates.
      </InsightCell>
    </NotebookLayout>
  )
}
