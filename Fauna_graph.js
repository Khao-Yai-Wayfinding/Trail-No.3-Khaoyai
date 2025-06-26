// Color mapping for mammal types (example, adjust or expand as needed)
function colorByType(type) {
  if (!type) return "#4a5568"; // default gray

  const t = type.toLowerCase();
  if (t.includes('elephant')) return "#a0522d";
  if (t.includes('bear')) return "#5a3e1b";
  if (t.includes('cat')) return "#d2691e";
  if (t.includes('gibbon')) return "#6495ed";
  if (t.includes('deer')) return "#9acd32";
  if (t.includes('squirrel')) return "#ff8c00";
  if (t.includes('otter')) return "#20b2aa";
  if (t.includes('porcupine')) return "#8b4513";
  if (t.includes('macaque')) return "#daa520";
  if (t.includes('binturong')) return "#708090";
  if (t.includes('dhole')) return "#dc143c";
  return "#4a5568";
}

function sanitizeId(id) {
  return id.replace(/[^a-zA-Z0-9]/g, '');
}

function createLinks(nodes, filters) {
  const links = [];
  const noFilter = filters.type.length === 0;

  if (noFilter) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        links.push({ source: nodes[i].id, target: nodes[j].id });
      }
    }
  } else {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        if (filters.type.includes(a.type) && a.type === b.type) {
          links.push({ source: a.id, target: b.id });
        }
      }
    }
  }
  return links;
}

function drag(simulation) {
  return d3.drag()
    .on("start", (event, d) => {
      if (!event.active) simulation.alphaTarget(0.05).restart();
      d.fx = d.x;
      d.fy = d.y;
    })
    .on("drag", (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    })
    .on("end", (event, d) => {
      simulation.alphaTarget(0);
      if (window.innerWidth < 768) {
        d.fx = null;
        d.fy = null;
      }
    });
}

// Only show details (including image) for selected node
function updateInfoBox(nodes, selectedId = null) {
  const list = document.getElementById("nodeInfoList");
  if (!list) return;
  list.innerHTML = "";

  if (!nodes.length) {
    list.innerHTML = `<div style="color:#aaa; text-align:center; padding:20px;">No matching mammals found.</div>`;
    return;
  }

  nodes.forEach(node => {
    const card = document.createElement("div");
    card.className = "node-info-card";
    card.setAttribute("data-id", node.id);
    card.style.borderColor = colorByType(node.type);
    card.style.background = colorByType(node.type) + "22";

    // Title (always visible)
    const titleDiv = document.createElement("div");
    titleDiv.className = "node-title";
    titleDiv.textContent = node.name;
    titleDiv.style.fontWeight = "bold";

    // Details (hidden unless selected)
    const detailsDiv = document.createElement("div");
    detailsDiv.className = "node-details";
    detailsDiv.style.display = (selectedId === node.id) ? "block" : "none";

    // Image
    if (node.img && typeof node.img === "string" && node.img.trim() !== "") {
      let imgPath = node.img;
      if (!imgPath.startsWith("FaunaPic/")) imgPath = "FaunaPic/" + imgPath;
      const img = document.createElement("img");
      img.className = "tree-img"; // Use the same class as flora for consistency
      img.src = imgPath;
      img.alt = node.name;
      img.style.maxWidth = "100%";
      img.style.maxHeight = "120px";
      img.style.display = "block";
      img.style.marginBottom = "8px";
      img.style.borderRadius = "6px";
      img.onerror = function() {
        this.style.display = "none";
      };
      detailsDiv.appendChild(img);
    }

    const details = [
      { label: "Scientific", value: node.scientific },
      { label: "Type", value: node.type },
      { label: "Description", value: node.description }
    ];

    details.forEach(({ label, value }) => {
      if (value) {
        const div = document.createElement("div");
        div.innerHTML = `<b>${label}:</b> ${value}`;
        div.style.marginBottom = "6px";
        detailsDiv.appendChild(div);
      }
    });

    card.appendChild(titleDiv);
    card.appendChild(detailsDiv);
    list.appendChild(card);
  });
}

// Change drawMammalGraph to accept a container selector (default to #force-map)
window.drawMammalGraph = function (filters, containerSelector = "#force-map") {
  d3.select(containerSelector).selectAll("*").remove();

  if (!window.FaunaData || !window.FaunaData.nodes) {
    const container = document.querySelector(containerSelector);
    container.innerHTML = `<div style="color:#fff; font-family: monospace; padding:20px; text-align:center;">Loading mammal data...</div>`;
    return;
  }

  const filteredNodes = window.FaunaData.nodes.filter(d => {
    if (filters.type.length && !filters.type.includes(d.type)) return false;
    return true;
  });

  // By default, show only names (no details)
  updateInfoBox(filteredNodes, null);

  const links = createLinks(filteredNodes, filters);

  const container = document.querySelector(containerSelector);
  const width = container.clientWidth || 960;
  const height = container.clientHeight || 500;

  const svg = d3.select(containerSelector)
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const zoomable = svg.append("g").attr("class", "zoomable");

  const zoom = d3.zoom()
    .scaleExtent([1, 5])
    .translateExtent([[-width * 2, -height * 2], [width * 3, height * 3]])
    .on("zoom", (event) => zoomable.attr("transform", event.transform));

  svg.call(zoom);

  const defs = svg.append("defs");
  links.forEach(link => {
    const sourceNode = filteredNodes.find(n => n.id === (link.source.id || link.source));
    const targetNode = filteredNodes.find(n => n.id === (link.target.id || link.target));

    if (sourceNode && targetNode) {
      const gradId = `gradient-link-${sanitizeId(sourceNode.id)}-${sanitizeId(targetNode.id)}`;
      const grad = defs.append("linearGradient")
        .attr("id", gradId)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", 0).attr("x2", 1).attr("y2", 0);
      grad.append("stop").attr("offset", "0%").attr("stop-color", colorByType(sourceNode.type));
      grad.append("stop").attr("offset", "100%").attr("stop-color", colorByType(targetNode.type));
    }
  });

  const linkGroup = zoomable.append("g").attr("class", "links");
  const nodeGroup = zoomable.append("g").attr("class", "nodes");
  const labelGroup = zoomable.append("g").attr("class", "labels");

  const simulation = d3.forceSimulation(filteredNodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(200).strength(0.8))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(20))
    .force("x", d3.forceX(width / 2).strength(0.1))
    .force("y", d3.forceY(height / 2).strength(0.1));

  const linkElements = linkGroup.selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke-width", 1.5)
    .attr("stroke-opacity", 0.7)
    .attr("stroke", d => {
      const sourceId = sanitizeId(d.source.id || d.source);
      const targetId = sanitizeId(d.target.id || d.target);
      return `url(#gradient-link-${sourceId}-${targetId})`;
    });

  const tooltip = d3.select("#tooltip");

  const nodeElements = nodeGroup.selectAll("circle")
    .data(filteredNodes, d => d.id)
    .enter()
    .append("circle")
    .attr("r", 14)
    .attr("fill", d => colorByType(d.type))
    .attr("stroke", "#fff")
    .attr("stroke-width", 1)
    .style("cursor", "pointer")
    .call(drag(simulation))
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(`
        <strong>${d.name}</strong><br/>
        <em>${d.scientific || 'Unknown'}</em><br/>
        Type: ${d.type}
      `)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px");
    })
    .on("mouseout", () => tooltip.transition().duration(500).style("opacity", 0))
    .on("click", (event, d) => {
      // Show details for only the clicked node
      updateInfoBox(filteredNodes, d.id);
      // Optionally scroll to the info card
      const infoCard = document.querySelector(`.node-info-card[data-id="${d.id}"]`);
      if (infoCard) {
        infoCard.classList.add("selected-info-card");
        infoCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      event.stopPropagation();
    });

  svg.on("click", () => {
    // Hide all details when clicking outside nodes
    updateInfoBox(filteredNodes, null);
  });

  const labelElements = labelGroup.selectAll("text")
    .data(filteredNodes)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .attr("fill", "#fff")
    .attr("font-size", "6px")
    .attr("font-family", "Courier New, monospace")
    .attr("pointer-events", "none")
    .style("text-shadow", "1px 1px 1px rgba(0,0,0,0.8)")
    .text(d => d.name.length > 8 ? d.name.substring(0, 8) + "…" : d.name);

  simulation.on("tick", () => {
    filteredNodes.forEach(d => {
      d.x = Math.max(15, Math.min(width - 15, d.x));
      d.y = Math.max(15, Math.min(height - 15, d.y));
    });

    linkElements
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    nodeElements
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    labelElements
      .attr("x", d => d.x)
      .attr("y", d => d.y);
  });

  console.log(`Graph created with ${filteredNodes.length} nodes and ${links.length} links`);
};

// Load mammal data JSON and init graph
d3.json("FaunaData.json").then(data => {
  window.FaunaData = data;
  window.drawMammalGraph({ type: [] }, "#force-map");
}).catch(e => {
  console.error("Failed to load mammal data", e);
  const container = document.getElementById("force-map");
  container.innerHTML = "<div style='color:#f66; text-align:center; padding:20px;'>Failed to load mammal data</div>";
});

// You need to define this function:
// This function must call drawMammalGraph with the correct container!
window.drawFaunaGraph = function(containerSelector) {
  window.drawMammalGraph({ type: [] }, containerSelector);
};
