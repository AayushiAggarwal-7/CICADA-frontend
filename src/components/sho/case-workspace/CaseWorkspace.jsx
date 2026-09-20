import React, { useState } from 'react'
import CaseActivity from './CaseActivity'
import CaseDocuments from './CaseDocuments'
import CaseEvidence from './CaseEvidence'
import CaseFSL from './CaseFSL'
import CaseMore from './CaseMore'
import CaseOverview from './CaseOverview'
import CaseTeam from './CaseTeam'

const tabs = [
	{ id: 'overview', label: 'Overview' },
	{ id: 'documents', label: 'Documents' },
	{ id: 'evidence', label: 'Evidence' },
	{ id: 'team', label: 'Team' },
	{ id: 'fsl', label: 'FSL' },
	{ id: 'activity', label: 'Activity & Audit' },
	{ id: 'more', label: 'More' },
]

const tabComponents = { documents: CaseDocuments, evidence: CaseEvidence, team: CaseTeam, fsl: CaseFSL, activity: CaseActivity, more: CaseMore }

export default function CaseWorkspace({ caseItem, currentUser, onBack }) {
	const [activeTab, setActiveTab] = useState('overview')
	const TabContent = tabComponents[activeTab]
	const station = caseItem.policeStation || currentUser?.station || 'Central Police Station, Division I'

	return (
		<section className="sho-case-workspace" aria-labelledby="case-workspace-title">
			<header className="sho-case-workspace-header">
				<button type="button" className="sho-back-link" onClick={onBack}>← Back to My Cases</button>
				<div className="sho-case-workspace-identity">
					<div><p className="sho-eyebrow">Case workspace</p><h1 id="case-workspace-title">{caseItem.firNumber}</h1><h2>{caseItem.title}</h2></div>
					<div className="sho-case-workspace-context"><span>{station}</span><span className={`sho-case-progress ${caseItem.progressStatus.toLowerCase().replaceAll(' ', '-')}`}>{caseItem.progressStatus}</span><span>Primary IO: {caseItem.ioName || 'Not assigned'}</span>{caseItem.priority && <span>Priority: {caseItem.priority}</span>}</div>
				</div>
			</header>
			<nav className="sho-case-tabs" aria-label="Case workspace sections">
				{tabs.map((tab) => <button type="button" key={tab.id} className={activeTab === tab.id ? 'is-active' : ''} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>)}
			</nav>
			<div className="sho-case-workspace-content">
				{activeTab === 'overview' ? <CaseOverview caseItem={caseItem} /> : <TabContent caseItem={caseItem} />}
			</div>
		</section>
	)
}
