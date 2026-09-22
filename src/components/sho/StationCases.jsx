import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { masterCaseDatabase } from '../../data/demsData'

const progressFilters = ['All', 'Active', 'Under Investigation', 'In Court', 'Closed', 'Archived']
const priorityFilters = ['All', 'Critical', 'Urgent', 'Routine']

function getProgressStatus(caseItem) {
	if (caseItem.progressStatus) return caseItem.progressStatus
	if (caseItem.status?.toLowerCase().includes('court')) return 'In Court'
	return 'Under Investigation'
}


// The demo case model has no stationId, so existing police cases are the station metadata pool.
export function getStationCases(caseTeams) {
	const stationCases = masterCaseDatabase
		.filter((caseItem) => caseItem.orgType === 'police')
		.map((caseItem) => ({ ...caseItem, progressStatus: getProgressStatus(caseItem) }))
	if (!caseTeams) return stationCases
	return stationCases.filter((caseItem) => {
		const team = caseTeams[caseItem.id] || []
		const hasAssignedTeam = team.length > 0
		const shoIsMember = team.some((member) => member.officerId === 'sho')
		return hasAssignedTeam && !shoIsMember
	})
}

export default function StationCases({ caseTeams = {} }) {
	const navigate = useNavigate()
	const [searchQuery, setSearchQuery] = useState('')
	const [progressFilter, setProgressFilter] = useState('All')
	const [priorityFilter, setPriorityFilter] = useState('All')
	const stationCases = useMemo(() => getStationCases(caseTeams), [caseTeams])
	const filteredCases = useMemo(() => {
		const query = searchQuery.trim().toLowerCase()
		return stationCases.filter((caseItem) => (
			(progressFilter === 'All' || caseItem.progressStatus === progressFilter)
			&& (priorityFilter === 'All' || caseItem.priority === priorityFilter)
			&& (!query || [caseItem.firNumber, caseItem.title, caseItem.ioName].some((field) => field?.toLowerCase().includes(query)))
		))
	}, [priorityFilter, progressFilter, searchQuery, stationCases])

	const activeCases = stationCases.filter((caseItem) => ['Active', 'Under Investigation'].includes(caseItem.progressStatus)).length
	const courtCases = stationCases.filter((caseItem) => caseItem.progressStatus === 'In Court').length
	const closedCases = stationCases.filter((caseItem) => ['Closed', 'Archived'].includes(caseItem.progressStatus)).length
	const clearFilters = () => {
		setSearchQuery('')
		setProgressFilter('All')
		setPriorityFilter('All')
	}

	return (
		<section className="sho-station-cases" aria-labelledby="station-cases-title">
			<header className="sho-station-heading"><div><p className="sho-eyebrow">Station supervisory view</p><h1 id="station-cases-title">Station Cases</h1><p>Supervisory view of cases handled by Central Police Station</p></div><div className="sho-station-scope"><span>Case scope</span><strong>Central Police Station</strong></div></header>
			<div className="sho-station-summary"><div><strong>{stationCases.length}</strong><span>Total station cases</span></div><div><strong>{activeCases}</strong><span>Active / under investigation</span></div><div><strong>{courtCases}</strong><span>In court</span></div><div><strong>{closedCases}</strong><span>Closed / archived</span></div></div>

			<div className="sho-station-toolbar"><label className="sho-inbox-search"><span>Search station cases</span><input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search FIR number, case title or investigating officer" /></label><label className="sho-station-select"><span>Progress status</span><select value={progressFilter} onChange={(event) => setProgressFilter(event.target.value)}>{progressFilters.map((filter) => <option key={filter}>{filter}</option>)}</select></label><label className="sho-station-select"><span>Priority</span><select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>{priorityFilters.map((filter) => <option key={filter}>{filter}</option>)}</select></label></div>

			<div className="sho-station-summary-line"><strong>{filteredCases.length}</strong> of {stationCases.length} cases shown</div>
			{stationCases.length === 0 ? <div className="sho-station-empty"><h2>No station cases available.</h2></div> : filteredCases.length === 0 ? <div className="sho-station-empty"><p>No cases match the current filters.</p><button type="button" className="sho-secondary-button" onClick={clearFilters}>Clear filters</button></div> : <div className="sho-station-table-wrap"><table className="sho-station-table"><thead><tr><th>FIR</th><th>Case</th><th>Investigating officer</th><th>Status</th><th>Stage</th><th>Priority</th><th>Team</th><th>Action</th></tr></thead><tbody>{filteredCases.map((caseItem) => { const team = caseTeams[caseItem.id] || []; const primary = team.find((member) => member.assignmentRole === 'Primary Investigating Officer'); return <tr key={caseItem.id}><td><strong className="sho-station-fir">{caseItem.firNumber}</strong><span>{caseItem.date}</span></td><td><strong className="sho-station-title">{caseItem.title}</strong><span>{caseItem.sections}</span></td><td>{caseItem.ioName || primary?.designation || 'Not assigned'}</td><td><span className={`sho-station-status ${caseItem.progressStatus.toLowerCase().replaceAll(' ', '-')}`}>{caseItem.progressStatus}</span></td><td>{caseItem.stage || 'Not recorded'}</td><td><span className={`sho-station-priority ${caseItem.priority?.toLowerCase() || 'routine'}`}>{caseItem.priority || 'Not recorded'}</span></td><td>{team.length ? `${team.length} officer${team.length === 1 ? '' : 's'}` : 'Team not recorded'}</td><td><button type="button" className="sho-open-station-case" onClick={() => navigate(`/dashboard/my-cases/${caseItem.id}`)}>Open Case</button></td></tr> })}</tbody></table></div>}
		</section>
	)
}
