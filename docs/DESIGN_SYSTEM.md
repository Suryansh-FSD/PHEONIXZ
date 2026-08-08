# PHOENIXZ — Design Tokens Specification

**Aesthetic Paradigm**: Bloomberg (High-density intelligence) + Stripe (Pristine precision borders) + Linear (Obsidian dark palette).

---

## 1. Typography Hierarchy
- **Header & Brand**: `18px / 1.2` Monospace, Bold Uppercase (`font-mono tracking-tight`)
- **Move Title**: `16px / 1.3` Sans, Bold, `text-pretty`
- **Analysis Content**: `14px / 1.5` Sans, Medium weight
- **Captions & Sub-scores**: `12px / 1.4` Monospace (`tabular-nums`)

---

## 2. Color Tokens Matrix
| Token | Dark Mode (Obsidian) | Light Mode (Slate Pristine) | Purpose |
| :--- | :--- | :--- | :--- |
| `phoenix.bg` | `#08080a` | `#fcfcfd` | Primary background canvas |
| `phoenix.card` | `#121215` | `#ffffff` | Primary container surface |
| `phoenix.elevated` | `#1a1a1e` | `#f4f4f5` | Hover & modal surfaces |
| `phoenix.border` | `#27272a` | `#e4e4e7` | Standard container border |
| `phoenix.text` | `#f4f4f5` | `#09090b` | High contrast primary text |
| `phoenix.accent` | `#f97316` | `#ea580c` | Brand accent & take border |
| `phoenix.live` | `#10b981` | `#059669` | Published / Live status |
| `phoenix.watch` | `#f59e0b` | `#d97706` | Watching / Memory status |
| `phoenix.reject` | `#ef4444` | `#dc2626` | Rejected / Hype filter status |

---

## 3. Spacing & Spatial Grid
- `--space-1` (4px)
- `--space-2` (8px)
- `--space-3` (12px)
- `--space-4` (16px)
- `--space-6` (24px)
- `--space-8` (32px)

---

## 4. Radius Tokens
- `rounded-xs`: `2px` (Precision badges & tags)
- `rounded-sm`: `4px` (Cards & containers)
- `rounded-md`: `6px` (Modals & dropdowns)
- `rounded-full`: `9999px` (Status indicators)

---

## 5. Animation & Focus Accessibility
- Timing Curve: `cubic-bezier(0.16, 1, 0.3, 1)` (`ease-editorial`)
- Keyboard Focus: `:focus-visible` outline rings on all interactive elements
- WCAG Contrast: Minimum `4.5:1` text contrast ratio across dark & light modes
