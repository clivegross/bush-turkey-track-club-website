# Agent Instructions for Bush Turkey Track Club Website

## Overview
This file provides guidance for AI agents assisting with updates to the Bush Turkey Track Club website. It covers three main tasks: updating club records, managing upcoming events, and handling previous/completed events.

---

## Task 1: Updating Club Records

### When to Apply This Task
User asks to update club records with new race results (e.g., "Add John's new 5K PB to the records" or "Update the marathon records with the 2026 race results").

### Required Information
The user must provide:
- **Athlete name** (at least 1)
- **Finish time** 
- **Race distance** (3000m, 5km, 10km, half marathon, or marathon)
- **Sex/Gender** (Men or Women)
- Year (if not provided, assume the current year: 2026)

### Record Categories & Structure
Records are organized in `records.html` with these distance categories and ID anchors:

| Distance | ID Anchor | Format |
|----------|-----------|--------|
| Marathon | `id="marathon"` | MM:SS:CC (e.g., 2:27:14) |
| Half Marathon | `id="half-marathon"` | MM:SS:CC (e.g., 1:09:39) |
| 10km | `id="10km"` | MM:SS (e.g., 32:40) |
| 5km | `id="5km"` | MM:SS (e.g., 15:09) |
| 3000m Track | `id="3000m"` | MM:SS.CC (e.g., 9:00.36) |

### Process for Updating Records

1. **Locate the correct distance section** in `records.html` using the ID anchors above
2. **Identify the gender category** (Men or Women) within that section
3. **Analyze the existing records** - they are in descending speed order (fastest first)
4. **Determine placement** - insert the new record in the correct position based on time
5. **Format the entry**: `<li>Name - Time (Year)</li>`
6. **Update last modified date** - Change the "Last updated" date in the header (currently "June 2026")

### Example Record Update

**Before:**
```html
<h4>Men</h4>
<ol>
  <li>Clive Gross - 32:40 (2025)</li>
  <li>Stephen Butcher - 32:54 (2025)</li>
  <li>Michael Cnops - 33:08 (2025)</li>
</ol>
```

**After updating with a new 10km record:**
```html
<h4>Men</h4>
<ol>
  <li>John Smith - 32:35 (2026)</li>
  <li>Clive Gross - 32:40 (2025)</li>
  <li>Stephen Butcher - 32:54 (2025)</li>
  <li>Michael Cnops - 33:08 (2025)</li>
</ol>
```

---

## Task 2: Updating Upcoming Events

### When to Apply This Task
User asks to update the website for an upcoming event (e.g., "Update the website for the Bush Turkey Classic 2026").

### Process

1. **Update `index.html` upcoming events section**
   - Locate the current "upcoming event" announcement
   - Replace it with details of the new upcoming event
   - Remove the previous event from the "upcoming" section

2. **Retire the previous upcoming event**
   - The old upcoming event becomes a "previous event" 
   - It should be archived or moved to the events page

3. **Create a new HTML document for the upcoming event**
   - File naming: Use a descriptive name (e.g., `bush-turkey-classic-2026.html`)
   - Replicate content structure from the most recent year's matching event
   - Example: If creating 2026 Bush Turkey Classic, base it on `bush-turkey-classic-2025.html` or similar

4. **Update the "Previous Events" section** in the new document
   - Replicate the previous event's "previous events" section
   - Add a new link at the TOP of this section pointing to the previous year's event
   - Example format: `<li><a href="bush-turkey-classic-2025.html">Bush Turkey Classic 2025</a></li>`

5. **Link the document from index.html**
   - Add/update the link to the new event page in the upcoming events section

### File Structure Considerations
- Use consistent naming conventions: `event-name-year.html`
- Maintain consistent HTML structure with other event pages
- Include navigation links for consistency
- Update any relevant dates, times, and registration information

---

## Task 3: Managing Previous Events

### When to Apply This Task
User asks to:
- Create a new page for a recently completed event
- Update an existing event page with results or photos
- Archive past event information

### Process A: Creating a New Page for a Completed Event

1. **Determine if a page already exists**
   - Check if the event has a dedicated HTML page

2. **If creating a new page:**
   - Use the most recent year's matching event page as a template
   - Copy the HTML structure and styling
   - Update all content to reflect the completed event:
     - Event date (now in the past)
     - Results if available
     - Photos from the event
     - Athlete information
   - Update the "Previous Events" section to link to earlier editions

3. **Add the new page to site navigation**
   - Update `index.html` or `events.html` to include a link
   - Ensure it's discoverable from the website navigation

### Process B: Updating an Existing Event Page

1. **Add Results Section**
   - Create a results table or list showing finishers
   - Format: Name, Time, Gender/Category
   - Sort by time (fastest first) if displaying records

2. **Add Photos**
   - Create an images folder for the event: `images/event-name-year/`
   - Add photos with descriptive alt text
   - Follow existing image optimization practices

3. **Update Event Information**
   - Add final attendance numbers
   - Include any notable achievements or records set
   - Update links and registration information

4. **Maintain "Previous Events" Links**
   - Update the page's "Previous Events" section
   - Add links to older editions of the same event
   - Keep chronological order (newest first at the top)

### Example "Previous Events" Section

```html
<h3>Previous Events</h3>
<ul>
  <li><a href="bush-turkey-classic-2024.html">Bush Turkey Classic 2024</a></li>
  <li><a href="bush-turkey-classic-2023.html">Bush Turkey Classic 2023</a></li>
  <li><a href="bush-turkey-classic-2022.html">Bush Turkey Classic 2022</a></li>
</ul>
```

---

## General Guidelines

- **Year assumption**: If a year is not explicitly stated by the user, assume 2026
- **Record accuracy**: Always verify times are in the correct format for the distance
- **Consistency**: Maintain consistent formatting and styling across all updates
- **Navigation**: Update relevant index pages and navigation menus when adding new content
- **Images**: Use descriptive alt text for all images for accessibility
- **Testing**: After updates, verify all links work and content displays correctly

---

## Quick Reference

| Task | Key File | Required Info |
|------|----------|--------------|
| Update Records | `records.html` | Name, Time, Distance, Gender, Year |
| Upcoming Event | `index.html` + new file | Event date, details, previous event page |
| Previous Event | New `.html` file | Event info, results, photos, previous events |
