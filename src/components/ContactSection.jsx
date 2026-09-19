import React from 'react'

/**
 * Contact Us Section (Exact Figma Page 1 Frame 2)
 * Centered #B37D2E heading with official contact details
 */
export default function ContactSection() {
  return (
    <section id="contact-section" className="contact-extended-section">
      <div className="site-container">
        <div className="section-header-block">
          <h2 className="section-heading-ochre">CONTACT US</h2>
          <p className="section-lead-paragraph">
            For queries, feedback, or technical support regarding e-SAKSHYA, reach out to the project team:
          </p>
        </div>

        <div className="contact-details-list-block">
          <div className="contact-line-item">
            <strong>Email:</strong> <a href="mailto:esakshya.co@gmail.com">esakshya.co@gmail.com</a>
          </div>
          <div className="contact-line-item">
            <strong>Project:</strong> Smart India Hackathon 2026 — Team CICADA
          </div>
          <div className="contact-line-item">
            <strong>Prototype note:</strong> This is a prototype developed for Smart India Hackathon. For production deployment, this section would be replaced with the responsible ministry's official support channels.
          </div>
        </div>
      </div>
    </section>
  )
}
