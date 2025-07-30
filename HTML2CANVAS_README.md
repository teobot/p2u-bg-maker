# HTML2Canvas Implementation

This project uses html2canvas for capturing screenshots of the background generator.

## Routes and Implementations

### 1. Standalone HTML2Canvas Route (`/html2canvas`)
- **Location**: `src/app/html2canvas/page.tsx`
- **Description**: A standalone page that renders the background and provides a client-side html2canvas capture button
- **Usage**: Navigate to `/html2canvas?bg=#ffffff&icon=#3b82f6&logo=80`
- **Features**: 
  - Direct client-side html2canvas implementation
  - No server-side processing required
  - Captures the entire rendered background
  - Downloads as PNG file

### 2. Client-Side HTML2Canvas Action
- **Location**: `src/app/actions/clientHtml2Canvas.ts`
- **Description**: Pure client-side html2canvas implementation
- **Usage**: Called from the main page via the "Download with html2canvas" button
- **Features**:
  - Direct client-side processing
  - No server-side dependencies
  - May have CORS limitations with iframe content
  - Faster processing for same-origin content

## Main Page Integration

The main page (`src/app/page.tsx`) now includes one download option:

1. **Download with html2canvas** - Pure client-side html2canvas implementation

## Key Features

### HTML2Canvas Advantages:
- Better handling of CSS transforms and complex layouts
- More accurate rendering of web fonts
- Better support for CSS filters and effects
- Lighter weight for client-side processing
- No server-side dependencies required

## Usage Examples

### Direct Route Access
```
http://localhost:3000/html2canvas?bg=#ff0000&icon=#ffffff&logo=120
```

### Programmatic Usage
```typescript
// Client-side html2canvas
const blob = await clientHtml2Canvas(element);
```

## Configuration Options

HTML2Canvas is configured with the following options:
- `width: 1920` - Fixed width for consistent output
- `height: 1080` - Fixed height for consistent output
- `scale: 1` - No scaling for optimal quality
- `useCORS: true` - Enable cross-origin resource loading
- `allowTaint: true` - Allow tainted canvas for external resources
- `backgroundColor: null` - Transparent background
- `logging: false` - Disable console logging
- `removeContainer: true` - Clean up temporary elements
- `foreignObjectRendering: true` - Enable foreign object rendering

## Dependencies

The html2canvas implementation requires:
- `html2canvas: ^1.4.1` - Already included in package.json

## Browser Compatibility

HTML2Canvas works best with:
- Chrome/Chromium-based browsers
- Firefox
- Safari (with some limitations)
- Edge

## Troubleshooting

### CORS Issues
If you encounter CORS issues with the client-side implementation:
1. Ensure all resources are served from the same origin
2. Check that external images have proper CORS headers
3. Try the standalone html2canvas route for better compatibility

### Rendering Issues
If html2canvas doesn't render correctly:
1. Check that all fonts are properly loaded
2. Ensure all CSS is applied before capture
3. Try the standalone html2canvas route for better rendering 