import React from 'react'

/**
 * Universal Government Footer (Figma Page 1 Specification)
 */
export default function Footer({ copy }) {
  return (
    <footer className="gov-official-footer">
      <div className="site-container footer-flex-container">
        <div className="footer-left-meta">
          <strong>e-SAKSHYA</strong>
          <span className="footer-agency-sub">
            {copy.agency}
          </span>
        </div>

        <div className="footer-right-compliance">
          <span>{copy.compliance}</span>
          <span className="footer-dot-sep">•</span>
          <span>© {new Date().getFullYear()} {copy.rights}</span>
        </div>
      </div>
    </footer>
  )
}

