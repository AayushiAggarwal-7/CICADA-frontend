import React from 'react'

export default function CaseOverview({ caseItem }) {
	return (
		<div className="sho-case-overview">
			<div className="sho-overview-grid">
				<section className="sho-overview-panel sho-overview-summary"><p className="sho-eyebrow">Case summary</p><h2>Occurrence overview</h2><p>{caseItem.summary || 'No occurrence summary has been recorded for this case.'}</p></section>
				<section className="sho-overview-panel"><p className="sho-eyebrow">Current position</p><dl className="sho-overview-facts"><div><dt>Case status</dt><dd>{caseItem.progressStatus}</dd></div><div><dt>Investigation stage</dt><dd>{caseItem.stage || 'Not recorded'}</dd></div><div><dt>Primary IO</dt><dd>{caseItem.ioName || 'Not assigned'}</dd></div><div><dt>Priority</dt><dd>{caseItem.priority || 'Routine'}</dd></div></dl></section>
				<section className="sho-overview-panel"><p className="sho-eyebrow">Case record</p><dl className="sho-overview-facts"><div><dt>FIR date</dt><dd>{caseItem.date || 'Not recorded'}</dd></div><div><dt>Evidence items</dt><dd>{caseItem.evidenceItems ?? 0}</dd></div><div><dt>Case diary entries</dt><dd>{caseItem.caseDiaryEntries ?? 0}</dd></div><div><dt>Legal sections</dt><dd>{caseItem.sections || 'Not recorded'}</dd></div></dl></section>
			</div>
			<section className="sho-overview-panel sho-overview-notes"><div className="sho-overview-panel-heading"><div><p className="sho-eyebrow">Recent notes</p><h2>Initial case notes</h2></div><span>{caseItem.initialNotes?.length || 0} notes</span></div>{caseItem.initialNotes?.length ? <div className="sho-note-list">{caseItem.initialNotes.map((note) => <article key={note.id}><div><strong>{note.author}</strong><time>{note.timestamp}</time></div><p>{note.text}</p></article>)}</div> : <p className="sho-muted-copy">No initial notes have been recorded for this case.</p>}</section>
			<section className="sho-overview-panel sho-pending-actions"><p className="sho-eyebrow">Follow-up</p><h2>Pending actions</h2><p>{caseItem.stage ? `Current focus: ${caseItem.stage}.` : 'No pending actions are recorded for this case.'}</p></section>
		</div>
	)
}
