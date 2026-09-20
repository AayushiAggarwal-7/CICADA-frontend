import React from 'react'

const navigationItems = [
	{ id: 'dashboard', label: 'Dashboard', icon: '▦' },
	{ id: 'fir-inbox', label: 'FIR Inbox', icon: '□' },
	{ id: 'my-cases', label: 'My Cases', icon: '✓' },
	{ id: 'station-cases', label: 'Station Cases', icon: '≡' },
	{ id: 'search', label: 'Search', icon: '⌕' },
]

export default function SHOSidebar({ currentUser, activeSection, onSectionChange, onOpenProfile }) {
	const initials = (currentUser?.name || 'Officer')
		.split(' ')
		.slice(0, 2)
		.map((part) => part[0])
		.join('')

	return (
		<aside className="sho-sidebar" aria-label="SHO workspace navigation">
			<button type="button" className="sho-profile-block" onClick={onOpenProfile}>
				<span className="sho-profile-avatar">{initials}</span>
				<span className="sho-profile-details">
					<strong>{currentUser?.name || 'Rajesh Kumar Sharma'}</strong>
					<small>Station House Officer</small>
				</span>
			</button>
			<div className="sho-sidebar-rule" />
			<nav className="sho-sidebar-nav">
				<p className="sho-nav-label">Station workspace</p>
				{navigationItems.map((item) => (
					<button
						type="button"
						key={item.id}
						className={`sho-nav-item ${activeSection === item.id ? 'is-active' : ''}`}
						onClick={() => onSectionChange(item.id)}
						aria-current={activeSection === item.id ? 'page' : undefined}
					>
						<span className="sho-nav-icon" aria-hidden="true">{item.icon}</span>
						<span>{item.label}</span>
					</button>
				))}
			</nav>
			<div className="sho-sidebar-footer">
				<span className="sho-status-dot" aria-hidden="true" />
				<span>Station network online</span>
			</div>
		</aside>
	)
}
