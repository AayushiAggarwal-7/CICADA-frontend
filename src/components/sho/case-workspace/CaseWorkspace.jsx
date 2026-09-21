import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { policeRoles } from '../../../data/policeData'
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

function getAssignedCases(currentUser) {
	const roleId = currentUser?.roleId === 'police_sho' ? 'sho' : currentUser?.roleId?.replace(/^police_/, '')
	const policeRole = policeRoles.find((role) => role.id === roleId) || policeRoles.find((role) => role.id === 'sho')
	return (policeRole?.ownCases || []).map((caseItem) => ({
		...caseItem,
		progressStatus: caseItem.progressStatus || (caseItem.status?.toLowerCase().includes('court') ? 'In Court' : 'Under Investigation'),
		priority: caseItem.priority || (caseItem.statusLevel === 'critical' ? 'Critical' : caseItem.statusLevel === 'urgent' ? 'Urgent' : 'Routine'),
	}))
}

export default function CaseWorkspace({ currentUser }) {
	const { caseId } = useParams()
	const navigate = useNavigate()
	const caseItem = getAssignedCases(currentUser).find((item) => item.id === caseId)
	const [activeTab, setActiveTab] = useState('overview')

	if (!caseItem) {
		return (
			<section className="sho-workspace-view sho-empty-state" aria-labelledby="case-not-found-title">
				<h1 id="case-not-found-title">Case not found</h1>
				<p>The requested case could not be found in your assigned casework.</p>
				<Link className="sho-primary-button" to="/dashboard/my-cases">Back to My Cases</Link>
			</section>
		)
	}
	const TabContent = tabComponents[activeTab]
	const station = caseItem.policeStation || currentUser?.station || 'Central Police Station, Division I'

	return (
		<section className="sho-case-workspace" aria-labelledby="case-workspace-title">
			<header className="sho-case-workspace-header">
				<button type="button" className="sho-back-link" onClick={() => navigate('/dashboard/my-cases')}>← Back to My Cases</button>
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
