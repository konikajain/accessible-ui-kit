import { useState } from 'react'

// WCAG contrast ratio formula
function getLuminance(hex) {
  const rgb = hex.match(/\w\w/g).map(x => {
    const val = parseInt(x, 16) / 255
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]
}

function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(hex1)
  const l2 = getLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker  = Math.min(l1, l2)
  return ((lighter + 0.05) / (darker + 0.05)).toFixed(2)
}

function getWCAGLevel(ratio) {
  if (ratio >= 7)   return { level: 'AAA', color: '#34d399', pass: true  }
  if (ratio >= 4.5) return { level: 'AA',  color: '#34d399', pass: true  }
  if (ratio >= 3)   return { level: 'AA Large', color: '#fbbf24', pass: true  }
  return               { level: 'Fail',    color: '#f87171', pass: false }
}

// preset examples
const PRESETS = [
  {
    label: 'Light grey on white',
    fg: '#aaaaaa',
    bg: '#ffffff',
    bad: true,
    note: 'Common mistake — looks clean but fails WCAG AA',
  },
  {
    label: 'White on light blue',
    fg: '#ffffff',
    bg: '#63b3ed',
    bad: true,
    note: 'Popular in UI kits but fails for normal text',
  },
  {
    label: 'Dark grey on white',
    fg: '#374151',
    bg: '#ffffff',
    bad: false,
    note: 'Safe choice — passes AA and AAA',
  },
  {
    label: 'White on dark',
    fg: '#ffffff',
    bg: '#111827',
    bad: false,
    note: 'Classic dark mode — passes AAA',
  },
  {
    label: 'Yellow on white',
    fg: '#fbbf24',
    bg: '#ffffff',
    bad: true,
    note: 'Looks bright but very low contrast',
  },
  {
    label: 'Black on yellow',
    fg: '#000000',
    bg: '#fbbf24',
    bad: false,
    note: 'High visibility — used in warning signs',
  },
]

function ContrastDemo() {
  const [fg, setFg] = useState('#aaaaaa')
  const [bg, setBg] = useState('#ffffff')

  const ratio = getContrastRatio(fg.replace('#', ''), bg.replace('#', ''))
  const wcag  = getWCAGLevel(Number(ratio))

  function applyPreset(preset) {
    setFg(preset.fg)
    setBg(preset.bg)
  }

  return (
    <div>
      <div className="demo-header">
        <h2>Color Contrast — WCAG 1.4.3</h2>
        <p>
          WCAG requires a minimum contrast ratio of 4.5:1 for normal text and 3:1
          for large text. Poor contrast makes text unreadable for low vision users
          and fails legal accessibility requirements.
        </p>
      </div>

      {/* live checker */}
      <div className="card">
        <div className="card-title">Live Contrast Checker</div>

        <div className="contrast-checker-grid">

          {/* controls */}
          <div className="contrast-controls">
            <div className="color-picker-group">
              <label className="color-picker-label">Text color</label>
              <div className="color-picker-row">
                <input
                  type="color"
                  value={fg}
                  onChange={e => setFg(e.target.value)}
                  className="color-input"
                />
                <span className="color-hex">{fg}</span>
              </div>
            </div>

            <div className="color-picker-group">
              <label className="color-picker-label">Background color</label>
              <div className="color-picker-row">
                <input
                  type="color"
                  value={bg}
                  onChange={e => setBg(e.target.value)}
                  className="color-input"
                />
                <span className="color-hex">{bg}</span>
              </div>
            </div>

            {/* ratio result */}
            <div className="ratio-result">
              <div className="ratio-value" style={{ color: wcag.color }}>
                {ratio}:1
              </div>
              <div className="ratio-label">contrast ratio</div>
              <div className="ratio-badge" style={{ color: wcag.color, borderColor: wcag.color, background: `${wcag.color}18` }}>
                WCAG {wcag.level}
              </div>
            </div>

            {/* wcag levels explained */}
            <div className="wcag-levels">
              <div className={`wcag-level-row ${Number(ratio) >= 3   ? 'pass' : 'fail'}`}>
                <span>AA Large (3:1)</span>
                <span>{Number(ratio) >= 3   ? '✓ pass' : '✗ fail'}</span>
              </div>
              <div className={`wcag-level-row ${Number(ratio) >= 4.5 ? 'pass' : 'fail'}`}>
                <span>AA Normal (4.5:1)</span>
                <span>{Number(ratio) >= 4.5 ? '✓ pass' : '✗ fail'}</span>
              </div>
              <div className={`wcag-level-row ${Number(ratio) >= 7   ? 'pass' : 'fail'}`}>
                <span>AAA (7:1)</span>
                <span>{Number(ratio) >= 7   ? '✓ pass' : '✗ fail'}</span>
              </div>
            </div>
          </div>

          {/* preview */}
          <div
            className="contrast-preview"
            style={{ background: bg }}
          >
            <p className="preview-large" style={{ color: fg }}>
              Large Text (18px+)
            </p>
            <p className="preview-normal" style={{ color: fg }}>
              Normal body text at 16px. This is how your paragraph text appears to users.
              Low contrast makes this very hard to read for people with low vision.
            </p>
            <button
              className="preview-btn"
              style={{ color: fg, borderColor: fg, background: 'transparent' }}
            >
              Button Label
            </button>
          </div>

        </div>
      </div>

      {/* presets */}
      <div className="card">
        <div className="card-title">Common Examples — click to load</div>
        <div className="presets-grid">
          {PRESETS.map((preset, i) => {
            const r     = getContrastRatio(preset.fg.replace('#',''), preset.bg.replace('#',''))
            const level = getWCAGLevel(Number(r))
            return (
              <button
                key={i}
                className="preset-card"
                onClick={() => applyPreset(preset)}
              >
                {/* color swatch */}
                <div
                  className="preset-swatch"
                  style={{ background: preset.bg, color: preset.fg }}
                >
                  Aa
                </div>

                <div className="preset-info">
                  <div className="preset-label">{preset.label}</div>
                  <div className="preset-note">{preset.note}</div>
                  <div className="preset-ratio" style={{ color: level.color }}>
                    {r}:1 — {level.level}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* why it matters */}
      <div className="card">
        <div className="card-title">Why This Matters</div>
        <div className="why-grid">
          <div className="why-item">
            <div className="why-icon">👁️</div>
            <div className="why-text">
              <strong>Low vision users</strong> — 246 million people worldwide have moderate
              to severe vision impairment. Poor contrast makes your UI unusable for them.
            </div>
          </div>
          <div className="why-item">
            <div className="why-icon">☀️</div>
            <div className="why-text">
              <strong>Outdoor screens</strong> — Even users without disabilities struggle
              with low contrast text in bright sunlight on mobile.
            </div>
          </div>
          <div className="why-item">
            <div className="why-icon">⚖️</div>
            <div className="why-text">
              <strong>Legal requirement</strong> — WCAG AA compliance is required by law
              in many countries including the US (ADA), UK (PSBAR), and EU (EN 301 549).
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ContrastDemo