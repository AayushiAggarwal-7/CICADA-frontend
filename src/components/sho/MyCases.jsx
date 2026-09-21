import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { policeRoles } from '../../data/policeData'

const progressFilters = ['All', 'Active', 'Under Investigation', 'In Court', 'Closed', 'Archived']

function getPoliceRole(currentUser) {
	if (currentUser?.roleId === 'police_sho') return policeRoles.find((role) => role.id === 'sho')
	const roleId = currentUser?.roleId?.replace(/^police_/, '')
	return policeRoles.find((role) => role.id === roleId) || policeRoles.find((role) => role.id === 'sho')
}

function matchesSearch(caseItem, query) {
	return [caseItem.firNumber, caseItem.title, caseItem.sections, caseItem.stage]
		.some((field) => field?.toLowerCase().includes(query))
}

function getProgressStatus(caseItem) {
	if (caseItem.progressStatus) return caseItem.progressStatus
	if (caseItem.statusLevel === 'routine' && caseItem.status?.toLowerCase().includes('court')) return 'In Court'
	if (caseItem.status?.toLowerCase().includes('court')) return 'In Court'
	return 'Under Investigation'
}

function getPriority(caseItem) {
	if (caseItem.priority) return caseItem.priority
	if (caseItem.statusLevel === 'critical') return 'Critical'
	if (caseItem.statusLevel === 'urgent') return 'Urgent'
	return 'Routine'
}

function CaseListItem({ caseItem, onOpen }) {
	return (
		<article className="sho-my-case-item">
			<div className="sho-my-case-main">
				<span className="sho-case-number">{caseItem.firNumber}</span>
				<h2>{caseItem.title}</h2>
				<p className="sho-my-case-stage"><strong>Investigation stage:</strong> {caseItem.stage || 'Stage not recorded'}</p>
			</div>
			<div className="sho-my-case-meta">
				<span className={`sho-case-progress ${caseItem.progressStatus.toLowerCase().replaceAll(' ', '-')}`}>{caseItem.progressStatus}</span>
				<div><span>Primary IO</span><strong>{caseItem.ioName || 'Not assigned'}</strong></div>
				<div><span>Priority</span><strong className={`sho-priority-text ${caseItem.priority?.toLowerCase()}`}>{caseItem.priority || 'Routine'}</strong></div>
				<div><span>Evidence</span><strong>{caseItem.evidenceItems ?? 0}</strong></div>
				<div><span>Case diary</span><strong>{caseItem.caseDiaryEntries ?? 0}</strong></div>
			</div>
			<button type="button" className="sho-primary-button sho-open-case-button" onClick={() => onOpen(caseItem)}>Open Case <span aria-hidden="true">→</span></button>
		</article>
	)
}

export default function MyCases({ currentUser }) {
	const navigate = useNavigate()
	const [searchQuery, setSearchQuery] = useState('')
	const [activeFilter, setActiveFilter] = useState('All')
	const policeRole = getPoliceRole(currentUser)
	const cases = (policeRole?.ownCases || []).map((caseItem) => ({
		...caseItem,
		progressStatus: getProgressStatus(caseItem),
		priority: getPriority(caseItem),
	}))
	const filteredCases = useMemo(() => {
		const query = searchQuery.trim().toLowerCase()
		return cases.filter((caseItem) => (
			(activeFilter === 'All' || caseItem.progressStatus === activeFilter)
			&& (!query || matchesSearch(caseItem, query))
		))
	}, [activeFilter, cases, searchQuery])

	return (
		<section className="sho-workspace-view sho-my-cases" aria-labelledby="my-cases-title">
			<header className="sho-workspace-heading">
				<div>
					<p className="sho-eyebrow">Assigned casework</p>
					<h1 id="my-cases-title">My Cases</h1>
					<p>Cases directly assigned to you for investigation and station oversight.</p>
				</div>
				<div className="sho-my-cases-count"><strong>{filteredCases.length}</strong><span>cases shown</span></div>
			</header>

			<div className="sho-my-cases-toolbar">
				<label className="sho-inbox-search"><span>Search cases</span><input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="FIR no., title, section or stage" /></label>
				<div className="sho-inbox-filters" role="group" aria-label="Filter cases by progress status">
					{progressFilters.map((filter) => <button type="button" key={filter} className={activeFilter === filter ? 'is-active' : ''} onClick={() => setActiveFilter(filter)}>{filter}</button>)}
				</div>
			</div>

			<div className="sho-my-case-list">
				{filteredCases.map((caseItem) => <CaseListItem key={caseItem.id} caseItem={caseItem} onOpen={(selectedCase) => navigate(`/dashboard/my-cases/${selectedCase.id}`)} />)}
				{filteredCases.length === 0 && <div className="sho-empty-state sho-my-cases-empty">No cases match the current search and progress filter.</div>}
			</div>
		</section>
	)
}
