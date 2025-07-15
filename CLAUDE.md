# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a luxury car rental website built as a single-page application. The entire application is contained in one `index.html` file (2,283 lines) that includes all HTML, CSS, and JavaScript inline.

## Architecture

- **Single File Application**: All code is in `index.html`
- **No Build Process**: Static HTML served directly
- **No Dependencies**: Pure HTML/CSS/JavaScript with no frameworks
- **External Assets**: Car images loaded from external CDNs
- **Deployment**: Configured for Replit static hosting

## Key Sections in index.html

1. **CSS Styles** (lines ~8-806): Custom styling with CSS variables, animations, and responsive design
2. **HTML Structure** (lines ~807-2150): Main content including navigation, hero, fleet showcase, about, and contact sections
3. **JavaScript** (lines ~2151-2283): Welcome popup logic and basic DOM manipulation

## Common Development Tasks

### Running the Development Server
```bash
# Using Replit's static web server
static-web-server -w ./.config/static-web-server.toml
```

### Making Style Changes
- CSS variables are defined at the root level (starting around line 10)
- Main color scheme: Gold (#D4AF37) with dark backgrounds
- Responsive breakpoints: 768px for mobile

### Updating Car Inventory
- Car data is hardcoded in the fleet section (starting around line 889)
- Each car card includes: image URL, name, specs (top speed, horsepower, seats), and rental price
- Contact buttons use WhatsApp/phone/Instagram links with pre-filled messages

### Contact Information
- WhatsApp: +971502136375
- Phone: +971502136375  
- Instagram: @exclusivedriveuae_com

## Important Considerations

- **No Version Control for Assets**: All images are external URLs that could break
- **Performance**: Large inline CSS/JS could benefit from separation and minification
- **SEO**: Limited meta tags and no structured data
- **Accessibility**: Basic structure but could use ARIA labels and better semantic HTML

## Future Improvements to Consider

1. **Modularization**: Split HTML, CSS, and JavaScript into separate files
2. **Build Process**: Add bundling and minification for production
3. **Asset Management**: Host images locally with optimization
4. **Component Structure**: Break down the monolithic file into reusable components
5. **Testing**: Add a testing framework for JavaScript functionality