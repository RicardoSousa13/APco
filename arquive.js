// -------------------------------
// 👇 GLOBAL PROJECT STORAGE
// -------------------------------
let allProjects = [];

// -------------------------------
// 👇 FETCH DATA FROM JSON FILE
// -------------------------------
fetch("projects.json")
  .then((response) => response.json())
  .then((data) => {
    allProjects = data.projects;

    // Populate dropdown filters (no year)
    populateFilters(allProjects);

    // Initial render: all non-featured projects
    renderProjects(allProjects, false);
  });

// -------------------------------
// 👇 RENDER PROJECTS INTO THE PAGE
// -------------------------------
function renderProjects(projects, showFeaturedOnly = false) {
  const archiveList = document.querySelector(".archive-list");
  archiveList.innerHTML = ""; // Clear previous content

  const visibleProjects = projects.filter((project) => {
    if (showFeaturedOnly) return project.type === "featured";
    return project.type !== "featured";
  });

  visibleProjects.forEach((project) => {
    const details = document.createElement("details");
    details.setAttribute("data-type", project.type);
    details.setAttribute("data-year", project.year); // still set for display
    details.setAttribute("data-local", project.local);
    details.setAttribute("data-category", project.category);
    details.setAttribute("data-featured", project.type === "featured");

    // If featured, add special class and open by default
    if (project.type === "featured") {
      details.classList.add("featured-project");
      details.setAttribute("open", true);
    }

    // Create <summary> block
    const summary = document.createElement("summary");
    summary.className = "sections archive-grid";

    summary.innerHTML = `
      <div class="collab">${project.collab || ""}</div>
      <div class="year">${project.year || ""}</div>
      <div class="title">${project.title || ""}</div>
      <div class="local">${project.local || ""}</div>
      <div class="category">${project.category || ""}</div>
      <div class="status">${project.status || ""}</div>
    `;

    details.appendChild(summary);

    // If expandable or featured, add content block
    if (project.type === "expandable" || project.type === "featured") {
      const content = document.createElement("div");
      content.className = "project-content";

      // Create the horizontal image
      const imgHorizontal = document.createElement("img");
      imgHorizontal.src = project.imageHorizontal;
      imgHorizontal.alt = "Horizontal image";

      // Create the vertical image
      const imgVertical = document.createElement("img");
      imgVertical.src = project.imageVertical;
      imgVertical.alt = "Vertical image";

      // Create the info container
      const info = document.createElement("div");
      info.className = "project-info";

      // Create the description paragraph
      const description = document.createElement("p");
      description.innerHTML = project.description;

      // Append the description to the info block
      info.appendChild(description);

      // If featured, add the link inside the info block
      if (project.type === "featured" && project.link) {
        const link = document.createElement("a");
        link.href = project.link;
        link.textContent = "View Project → ";
        link.classList.add("featured-link");
        info.appendChild(link);
      }

      // Append all to content
      content.appendChild(imgHorizontal);
      content.appendChild(imgVertical);
      content.appendChild(info);

      // Finally, append content to the project <details>
      details.appendChild(content);
    }

    archiveList.appendChild(details);
  });

  // Update project count
  document.getElementById(
    "project-counter"
  ).textContent = `${visibleProjects.length} project(s)`;
}

// -------------------------------
// 👇 POPULATE DROPDOWN FILTERS (no year)
// -------------------------------
function populateFilters(projects) {
  const collaborations = new Set();
  const locals = new Set();
  const categories = new Set();

  projects.forEach((project) => {
    if (project.type !== "featured") {
      collaborations.add(project.collab);
      locals.add(project.local);
      categories.add(project.category);
    }
  });

  fillSelect("filter-collaboration", collaborations);
  fillSelect("filter-local", locals);
  fillSelect("filter-category", categories);
}

function fillSelect(id, items) {
  const select = document.getElementById(id);
  if (!select) return; // safeguard
  [...items].sort().forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    select.appendChild(option);
  });
}

// -------------------------------
// 👇 SINGLE FILTER AT A TIME HANDLING
// -------------------------------
function filterAndRenderSingle(filterId) {
  // Reset all other dropdowns to "all"
  ["filter-collaboration", "filter-local", "filter-category"].forEach((id) => {
    if (id !== filterId) {
      document.getElementById(id).value = "all";
    }
  });

  const selectedValue = document.getElementById(filterId).value;

  let filtered = allProjects.filter((project) => {
    if (project.type === "featured") return false; // skip featured for now
    if (selectedValue === "all") return true;

    if (filterId === "filter-collaboration") {
      return project.collab === selectedValue;
    }
    if (filterId === "filter-local") {
      return project.local === selectedValue;
    }
    if (filterId === "filter-category") {
      return project.category === selectedValue;
    }
  });

  renderProjects(filtered, false);
}

// Attach change event listeners to dropdowns
["filter-collaboration", "filter-local", "filter-category"].forEach((id) => {
  document.getElementById(id).addEventListener("change", () => {
    filterAndRenderSingle(id);
  });
});
