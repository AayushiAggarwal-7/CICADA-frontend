import React from 'react'

function NotificationIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
		</svg>
	)
}

export default function SHOTopbar({ currentUser, onOpenProfile, onLogout }) {
	return (
		<header className="sho-topbar">
			<div className="sho-topbar-brand" aria-label="DEMS Digital Evidence Management System">
				<span className="sho-brand-seal">D</span>
				<span>
					<strong>DEMS</strong>
					<small>Digital Evidence Management System</small>
				</span>
			</div>
			<div className="sho-topbar-actions">
				<button type="button" className="sho-icon-button" title="Notifications" aria-label="Notifications">
					<NotificationIcon />
					<span className="sho-notification-dot" aria-hidden="true" />
				</button>
				<button type="button" className="sho-user-summary" onClick={onOpenProfile}>
					<span className="sho-user-summary-name">{currentUser?.name || 'Officer'}</span>
					<span className="sho-user-summary-role">{currentUser?.roleName || 'Station House Officer'}</span>
				</button>
				<button type="button" className="sho-logout-button" onClick={onLogout}>Logout</button>
			</div>
		</header>
	)
}
