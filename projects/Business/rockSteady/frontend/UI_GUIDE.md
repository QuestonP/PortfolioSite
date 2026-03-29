# Frontend UI Guide

## Color Palette

The UI uses a carefully crafted dark theme optimized for long-term viewing and focus:

```
Primary Background:    #0a0e27  (Deep blue-black - main background)
Surface Level 1:       #151b3f  (Chat area, main surfaces)
Surface Level 2:       #1a2047  (Buttons, inputs, interactive)
Border/Divider:        #2a3255  (Subtle separation lines)
Text Primary:          #e0e6ff  (Off-white, high contrast)
Text Secondary:        #8b92b8  (Dimmed text, less important)
Accent Color:          #6366f1  (Interactive, highlights)
Accent Hover:          #818cf8  (Brighter on hover)
```

## Component Hierarchy

### ChatInterface (Main Container)
- Sidebar (Agent status, tools list)
- Header (Controls, status indicator)
- Message Area (Chat history)
- Input Area (User input form)
- Tool Panel (Expandable)

### Message Bubbles
- User messages: Blue gradient (#0066ff to #0050cc)
- Assistant messages: Dark surface with border
- Timestamp: Muted text
- Avatar: Gradient icon backgrounds

### Inputs & Buttons
- Background: Dark surface
- Border: Subtle dark-border
- Focus: Dark accent (indigo)
- Hover: Slight brightening

## Animation Timings

```
Fast:      0.15s  (Hover effects, quick feedback)
Normal:    0.3s   (UI transitions, panel toggles)
Slow:      0.6s   (Loading states, entrance animations)
```

### Spring Animations
- Stiffness: 100 (snappy)
- Damping: 15 (slight overshoot)

Used for message entries and interactive responses.

## Responsive Design

- **Desktop (1024px+)**: Sidebar always visible, tool panel on right
- **Tablet (768px-1023px)**: Toggleable sidebar, tool panel as modal
- **Mobile (< 768px)**: Full-screen chat, sidebar modal overlay

## Accessibility

- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Focus visible states (ring-2 ring-offset)
- ✅ Reduced motion support
- ✅ High contrast text (#e0e6ff on #0a0e27)
- ✅ Semantic HTML structure

## Typography

- **Font Family**: System font stack (sans-serif)
- **Body Text**: 14-16px
- **Headings**: 18-24px (bold)
- **Labels**: 12-13px (uppercase, tracking)
- **Line Height**: 1.5 for body, 1.2 for headings

## Shadows & Depth

- **Subtle**: 0 1px 2px rgba(0,0,0,0.1)
- **Medium**: 0 4px 6px rgba(0,0,0,0.2)
- **Large**: 0 10px 25px rgba(0,0,0,0.3)
- **Glow**: 0 0 20px rgba(99,102,241,0.3) (accent)

## Component Spacing

```
Padding:   px-4 py-3 (Input/button)
Padding:   p-6 (Sections)
Gap:       gap-4 (Between major elements)
Margin:    mb-4 (Vertical spacing)
```

## Dark Mode Implementation

The theme uses Tailwind's dark mode with custom color configuration:

```typescript
colors: {
  dark: {
    bg: '#0a0e27',
    surface: '#151b3f',
    'surface-alt': '#1a2047',
    border: '#2a3255',
    text: '#e0e6ff',
    'text-muted': '#8b92b8',
    accent: '#6366f1',
    'accent-hover': '#818cf8',
  }
}
```

Apply with: `bg-dark-bg`, `text-dark-text`, `border-dark-border`, etc.

## Interactive States

### Button States
```
Default:   bg-dark-accent
Hover:     bg-dark-accent-hover (scale 1.05)
Active:    scale 0.95 (press feedback)
Disabled:  opacity-50 cursor-not-allowed
Focus:     ring-2 ring-dark-accent
```

### Input States
```
Default:   bg-dark-surface border-dark-border
Focus:     border-dark-accent ring-dark-accent
Disabled:  opacity-50 cursor-not-allowed
Error:     border-red-500
```

## Animation Library: Framer Motion

Common patterns used:

```typescript
// Entrance
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ type: 'spring', stiffness: 100 }}

// Hover
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}

// Presence
<AnimatePresence>
  {isVisible && <Component />}
</AnimatePresence>

// Stagger children
variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
```

## Design Principles

1. **Clarity**: Clean, uncluttered interface
2. **Consistency**: Repeated patterns and spacing
3. **Feedback**: Immediate visual response to interactions
4. **Performance**: Smooth 60fps animations
5. **Accessibility**: WCAG AA compliance
6. **Dark-first**: Optimized for dark environments
7. **Sharp Design**: Minimal border radius (rounded-lg max)

## Customization

To modify theme:

1. Edit `tailwind.config.ts` colors object
2. Update color references in components
3. Rebuild with `npm run build`

Example theme extension:
```typescript
colors: {
  dark: {
    bg: '#your-color',
    // ... other colors
  }
}
```

## Performance Tips

- ✅ Use Tailwind classes (already optimized)
- ✅ Memoize components with React.memo where needed
- ✅ Lazy load tool panel (already implemented)
- ✅ Debounce resize handlers
- ✅ Virtual scroll for long message lists (future)

## Browser DevTools

Useful tips:
- Use Redux DevTools for Zustand debugging
- React DevTools for component inspection
- Network tab to monitor API calls
- Performance tab for animation profiling
