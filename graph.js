function colorByType(type) {
  switch (type) {
    case "Deciduous": return "#1f77b4";
    case "Evergreen": return "#2ca02c";
    case "Fruit": return "#ff7f0e";
    case "Coniferous": return "#9467bd";
    case "Rattan": return "#8c564b";
    case "Orchid": return "#e377c2";
    case "Shrub": return "#7f7f7f";
    case "Vine": return "#bcbd22";
    case "Herb": return "#17becf";
    default: return "#cccccc";
  }
}

function sanitizeId(id) {
  return id.replace(/[^a-zA-Z0-9]/g, '');
}

function createLinks(nodes, filters) {
  const links = [];
  const noFilter = filters.type.length === 0 && filters.season.length === 0 && filters.size.length === 0;
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
        if (
          (filters.type.length && a.type === b.type && filters.type.includes(a.type)) ||
          (filters.season.length && a.season_note === b.season_note && filters.season.includes(a.season_note)) ||
          (filters.size.length && a.size === b.size && filters.size.includes(a.size))
        ) {
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
    });
}

function updateInfoBox(nodes) {
  const box = document.querySelector(".info-box");
  if (!box) return;
  box.innerHTML = "";

  if (!nodes.length) {
    box.innerHTML = "<div style='color:#aaa;'>No matching trees.</div>";
    return;
  }

  const list = document.createElement("div");
  list.className = "node-info-list";

  nodes.forEach(node => {
    const card = document.createElement("div");
    card.className = "node-info-card";
    card.setAttribute("data-id", node.id);
    card.style.borderColor = colorByType(node.type);
    card.style.background = colorByType(node.type) + "22";
    card.innerHTML = `
      <div class="node-title">${node.name}</div>
      ${node.img ? `<img src="TreePic3/${node.img}" alt="${node.name}" style="max-width:100%; max-height:120px; border-radius:8px; margin: 8px 0;">` : ''}
      <div><b>Scientific:</b> ${node.scientific}</div>
      <div><b>Season:</b> ${node.season_note}</div>
      <div><b>Type:</b> ${node.type}</div>
      <div><b>Size:</b> ${node.size}</div>
    `;
    list.appendChild(card);
  });

  box.appendChild(list);
}

window.drawGraphWithFilters = function (filters) {
  d3.select("#force-map").selectAll("*").remove();

  const filteredNodes = window.TreeData.nodes.filter(d => {
    const seasonMatch = !filters.season.length || filters.season.includes(d.season_note);
    const typeMatch = !filters.type.length || filters.type.includes(d.type);
    const sizeMatch = !filters.size.length || filters.size.includes(d.size);
    return seasonMatch && typeMatch && sizeMatch;
  });

  const links = createLinks(filteredNodes, filters);
  updateInfoBox(filteredNodes);

  const container = document.getElementById("force-map");
  const width = container.clientWidth || 960;
  const height = container.clientHeight || 500;

  const svg = d3.select("#force-map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const zoomable = svg.append("g").attr("class", "zoomable");
  svg.call(d3.zoom().on("zoom", (event) => {
    zoomable.attr("transform", event.transform);
  }));

  const defs = svg.append("defs");
  links.forEach(link => {
    const sourceNode = filteredNodes.find(n => n.id === (link.source.id || link.source));
    const targetNode = filteredNodes.find(n => n.id === (link.target.id || link.target));
    const gradId = `gradient-link-${sanitizeId(sourceNode.id)}-${sanitizeId(targetNode.id)}`;
    const grad = defs.append("linearGradient")
      .attr("id", gradId)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", 0).attr("x2", 1).attr("y2", 0);
    grad.append("stop").attr("offset", "0%").attr("stop-color", colorByType(sourceNode.type));
    grad.append("stop").attr("offset", "100%").attr("stop-color", colorByType(targetNode.type));
  });

  const linkGroup = zoomable.append("g").attr("class", "links");
  const nodeGroup = zoomable.append("g").attr("class", "nodes");
  const labelGroup = zoomable.append("g").attr("class", "labels");

  const simulation = d3.forceSimulation(filteredNodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(180).strength(0.7))
    .force("charge", d3.forceManyBody().strength(-150))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(18));

  linkGroup.selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke-width", 1.5)
    .attr("stroke-opacity", 0.6)
    .attr("stroke", d => {
      const sourceId = sanitizeId(d.source.id || d.source);
      const targetId = sanitizeId(d.target.id || d.target);
      return `url(#gradient-link-${sourceId}-${targetId})`;
    });

  nodeGroup.selectAll("circle")
    .data(filteredNodes, d => d.id)
    .enter()
    .append("circle")
    .attr("r", 14)
    .attr("fill", d => colorByType(d.type))
    .call(drag(simulation))
    .on("click", (event, d) => {
      document.querySelectorAll(".node-info-card").forEach(card => card.classList.remove("selected-info-card"));
      const infoCard = document.querySelector(`.node-info-card[data-id="${d.id}"]`);
      if (infoCard) {
        infoCard.classList.add("selected-info-card");
        infoCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      event.stopPropagation();
    });

  svg.on("click", () => {
    document.querySelectorAll(".node-info-card").forEach(card => card.classList.remove("selected-info-card"));
  });

  labelGroup.selectAll("text")
    .data(filteredNodes)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .attr("fill", "#fff")
    .attr("font-size", "12px")
    .attr("pointer-events", "none")
    .text(d => d.name);

  simulation.on("tick", () => {
    filteredNodes.forEach(d => {
      d.x = Math.max(14, Math.min(width - 14, d.x));
      d.y = Math.max(14, Math.min(height - 14, d.y));
    });

    linkGroup.selectAll("line")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    nodeGroup.selectAll("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    labelGroup.selectAll("text")
      .attr("x", d => d.x)
      .attr("y", d => d.y);
  });

  window.resetSimulation = () => {
    filteredNodes.forEach(d => {
      d.fx = null;
      d.fy = null;
    });
    simulation.alpha(1).restart();
  };
};

// Load the data and initialize TreeData
d3.json("TreeDataWithImg.json").then(data => {
  window.TreeData = data;
  drawGraphWithFilters({ type: [], season: [], size: [] }); // Draw full graph initially
});
