import React, { useEffect, useState } from 'react'

const assignmentRoles = [
	'Primary Investigating Officer',
	'Investigation Team Member',
	'Evidence / Custody Officer',
	'Field / Witness Support',
]

export default function FIRDetail({ fir, officerOptions, onAddOfficer, onRemoveOfficer, onBack, onClose }) {
	const [officerId, setOfficerId] = useState('')
	const [assignmentRole, setAssignmentRole] = useState(assignmentRoles[0])
	const [isAddingOfficer, setIsAddingOfficer] = useState(false)

	useEffect(() => {
		setOfficerId('')
		setAssignmentRole(assignmentRoles[0])
		setIsAddingOfficer(false)
	}, [fir.id])

	const selectedOfficer = officerOptions.find((officer) => officer.id === officerId)
	const existingPrimary = fir.team.find((teamMember) => teamMember.assignmentRole === 'Primary Investigating Officer')
	const assignedOfficerNames = new Set(fir.team.map((teamMember) => teamMember.officer))
	const availableOfficers = officerOptions.filter((officer) => !assignedOfficerNames.has(officer.name))
	const canAddPrimary = !existingPrimary

	const handleSubmit = (event) => {
		event.preventDefault()
		if (!selectedOfficer) return
		if (assignmentRole === 'Primary Investigating Officer' && !canAddPrimary) return
		onAddOfficer(fir.id, {
			officer: selectedOfficer.name,
			designation: selectedOfficer.designation,
			assignmentRole,
		})
		setOfficerId('')
		setAssignmentRole(assignmentRoles[0])
		setIsAddingOfficer(false)
	}

	return (
		<section className="sho-workspace-view sho-fir-detail" aria-labelledby="fir-detail-title">
			<header className="sho-detail-heading">
				<div><button type="button" className="sho-back-link" onClick={onBack}>← Back to FIR Inbox</button><p className="sho-eyebrow">FIR review record</p><h1 id="fir-detail-title">{fir.firNumber}</h1></div>
				<button type="button" className="sho-detail-close" title="Close FIR detail" aria-label="Close FIR detail" onClick={onClose}>×</button>
			</header>

			<div className="sho-fir-detail-grid">
				<section className="sho-detail-panel" aria-labelledby="fir-information-title">
					<div className="sho-detail-panel-heading"><div><p className="sho-eyebrow">Record information</p><h2 id="fir-information-title">FIR details</h2></div><span className={`sho-inbox-status ${fir.inboxStatus.toLowerCase().replace(' ', '-')}`}>{fir.inboxStatus}</span></div>
					<dl className="sho-detail-fields">
						<div><dt>Date</dt><dd>{fir.date}</dd></div><div><dt>Police station</dt><dd>{fir.policeStation}</dd></div><div><dt>Complainant</dt><dd>{fir.complainant || 'Recorded in station file'}</dd></div><div><dt>Current case progress</dt><dd>{fir.progressStatus}</dd></div><div><dt>FIR Review Status</dt><dd><span className={`sho-inbox-status ${fir.inboxStatus.toLowerCase().replace(' ', '-')}`}>{fir.inboxStatus}</span></dd></div><div className="sho-detail-field-wide"><dt>Offence / title</dt><dd>{fir.title}</dd></div><div className="sho-detail-field-wide"><dt>Legal sections</dt><dd>{fir.sections}</dd></div>
					</dl>
					<div className="sho-summary-block"><h3>Summary / occurrence description</h3><p>{fir.summary || fir.directive || 'Occurrence description is available in the station record.'}</p></div>
				</section>

				<section className="sho-detail-panel sho-assignment-panel" aria-labelledby="assignment-title">
					<div className="sho-detail-panel-heading"><div><p className="sho-eyebrow">Station command</p><h2 id="assignment-title">Investigation Team</h2><span className="sho-team-count">{fir.team.length} officer{fir.team.length === 1 ? '' : 's'}</span></div><button type="button" className="sho-add-officer-button" onClick={() => setIsAddingOfficer(true)} disabled={isAddingOfficer || availableOfficers.length === 0}>+ Add Officer</button></div>
					{fir.team.length > 0 ? (
						<div className="sho-team-list">
							{fir.team.map((teamMember) => (
								<div className="sho-team-member" key={teamMember.officer}>
									<div className="sho-team-member-copy"><span className="sho-team-role">{teamMember.assignmentRole}</span><strong>{teamMember.officer}</strong><small>{teamMember.designation}</small></div>
									<button type="button" className="sho-remove-officer" onClick={() => onRemoveOfficer(fir.id, teamMember.officer)}>Remove</button>
								</div>
							))}
						</div>
					) : <p className="sho-empty-team">No officers assigned. Add an officer to start the investigation team.</p>}
					{isAddingOfficer && (
						<form className="sho-assignment-form" onSubmit={handleSubmit}>
							<label>Officer<select value={officerId} onChange={(event) => setOfficerId(event.target.value)} required><option value="">Select officer</option>{availableOfficers.map((officer) => <option key={officer.id} value={officer.id}>{officer.name}</option>)}</select></label>
							<label>Designation<input type="text" value={selectedOfficer?.designation || ''} placeholder="Automatically populated" readOnly /></label>
							<label>Assignment Role<select value={assignmentRole} onChange={(event) => setAssignmentRole(event.target.value)}>{assignmentRoles.map((role) => <option key={role} value={role} disabled={role === 'Primary Investigating Officer' && !canAddPrimary}>{role}{role === 'Primary Investigating Officer' && !canAddPrimary ? ' (already assigned)' : ''}</option>)}</select></label>
							<div className="sho-assignment-actions"><button type="button" className="sho-cancel-button" onClick={() => setIsAddingOfficer(false)}>Cancel</button><button type="submit" className="sho-primary-button">Add to Team</button></div>
						</form>
					)}
				</section>
			</div>
		</section>
	)
}
