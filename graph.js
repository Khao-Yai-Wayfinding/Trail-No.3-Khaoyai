// Make treeData global so reset can clear fx/fy
window.treeData = {
  nodes: [
    {
      "id": "EagleWood,_Agarwood",
      "name": "EagleWood, Agarwood",
      "scientific": "Aquilaria crassna",
      "season_note": "Winter",
      "type": "Evergreen",
      "size": "Medium"
    },
    {
      "id": "Dipterocarpus_gracilis",
      "name": "Dipterocarpus gracilis",
      "scientific": "Dipterocarpus gracilis",
      "season_note": "Summer",
      "type": "Deciduous",
      "size": "Large"
    },
    {
      "id": "Calamus_viminalis_(Willd.)",
      "name": "Calamus viminalis (Willd.)",
      "scientific": "Calamus viminalis",
      "season_note": "Rainy",
      "type": "Rattan",
      "size": "Small"
    },
    {
      "id": "Wild_Nutmeg",
      "name": "Wild Nutmeg",
      "scientific": "Knema globularia",
      "season_note": "Summer",
      "type": "Evergreen",
      "size": "Medium"
    },
    {
      "id": "Aphanamixis_polystachya_(Wall.)_R._Parker",
      "name": "Aphanamixis polystachya (Wall.) R. Parker",
      "scientific": "Aphanamixis polystachya",
      "season_note": "Winter",
      "type": "Evergreen",
      "size": "Large"
    },
    {
      "id": "Needlewood",
      "name": "Needlewood",
      "scientific": "Schima wallichii",
      "season_note": "Rainy",
      "type": "Evergreen",
      "size": "Large"
    },
    {
      "id": "Magnolia_baillonii_(Pierre)",
      "name": "Magnolia baillonii (Pierre)",
      "scientific": "Magnolia baillonii",
      "season_note": "Winter",
      "type": "Evergreen",
      "size": "Medium"
    },
    {
      "id": "“Wai_Daeng”_Renanthera_coccinea_Lour.",
      "name": "“Wai Daeng” Renanthera coccinea Lour.",
      "scientific": "Renanthera coccinea",
      "season_note": "Summer",
      "type": "Orchid",
      "size": "Small"
    },
    {
      "id": "“Samek_Khao”_Agapetes_bracteata_Hook._f._ex_C._B._Clarke",
      "name": "“Samek Khao” Agapetes bracteata Hook. f. ex C. B. Clarke",
      "scientific": "Agapetes bracteata",
      "season_note": "Rainy",
      "type": "Shrub",
      "size": "Small"
    },
    {
      "id": "“Moli_Siam”_(Reevesia_pubescens_var._siamensis_(Craib)_Anthony)",
      "name": "“Moli Siam” (Reevesia pubescens var. siamensis (Craib) Anthony)",
      "scientific": "Reevesia pubescens",
      "season_note": "Winter",
      "type": "Shrub",
      "size": "Medium"
    },
    {
      "id": "“Khreua_Phu_Ngoen”_Argyreia_mollis_(Burm._f.)_Choisy",
      "name": "“Khreua Phu Ngoen” Argyreia mollis (Burm. f.) Choisy",
      "scientific": "Argyreia mollis",
      "season_note": "Summer",
      "type": "Vine",
      "size": "Small"
    },
    {
      "id": "“Euang_Nam_Tarn”_Dendrobium_heterocarpum_Lindl.",
      "name": "“Euang Nam Tarn” Dendrobium heterocarpum Lindl.",
      "scientific": "Dendrobium heterocarpum",
      "season_note": "Rainy",
      "type": "Orchid",
      "size": "Small"
    },
    {
      "id": "Nervilia_khaoyaica_Suddee_(Watthana_&_S.W._Gale)",
      "name": "Nervilia khaoyaica Suddee (Watthana & S.W. Gale)",
      "scientific": "Nervilia khaoyaica",
      "season_note": "Summer",
      "type": "Orchid",
      "size": "Small"
    },
    {
      "id": "Scutellaria_khaoyaiensis_A._J._Paton",
      "name": "Scutellaria khaoyaiensis A. J. Paton",
      "scientific": "Scutellaria khaoyaiensis",
      "season_note": "Winter",
      "type": "Herb",
      "size": "Small"
    },
    {
      "id": "Polypleurum_ubonense",
      "name": "Polypleurum ubonense",
      "scientific": "Polypleurum ubonense",
      "season_note": "Rainy",
      "type": "Herb",
      "size": "Small"
    },
    {
      "id": "Monolophus_saxicola_(K._Larsen)_Veldkamp_&_Mood",
      "name": "Monolophus saxicola (K. Larsen) Veldkamp & Mood",
      "scientific": "Monolophus saxicola",
      "season_note": "Winter",
      "type": "Herb",
      "size": "Small"
    }
  ],
  links: []
};

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

// Only connect nodes that share a filter value
function createLinks(nodes, filters) {
  const links = [];
  const noFilter = filters.type.length === 0 && filters.season.length === 0 && filters.size.length === 0;
  if (noFilter) {
    // Fully connect all nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        links.push({ source: nodes[i].id, target: nodes[j].id });
      }
    }
    return links;
  }
  // Otherwise, connect nodes that share any active filter value
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      let connected = false;
      if (filters.type.length && a.type === b.type && filters.type.includes(a.type)) connected = true;
      if (filters.season.length && a.season_note === b.season_note && filters.season.includes(a.season_note)) connected = true;
      if (filters.size.length && a.size === b.size && filters.size.includes(a.size)) connected = true;
      if (connected) {
        links.push({ source: a.id, target: b.id });
      }
    }
  }
  return links;
}

// Drag behavior: node stays where you leave it until reset
function drag(simulation) {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.05).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  function dragended(event, d) {
    simulation.alphaTarget(0);
    simulation.stop();
  }
  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

function updateInfoBox(filteredNodes) {
  const infoBox = document.querySelector('.info-box');
  if (!infoBox) return;
  // Remove old cards
  let list = infoBox.querySelector('.node-info-list');
  if (!list) {
    list = document.createElement('div');
    list.className = 'node-info-list';
    infoBox.appendChild(list);
  }
  list.innerHTML = '';
  if (filteredNodes.length === 0) {
    list.innerHTML = "<div style='color:#aaa;'>No trees found for this filter.</div>";
    return;
  }
  filteredNodes.forEach(node => {
    const card = document.createElement('div');
    card.className = 'node-info-card';
    card.style.borderColor = colorByType(node.type);
    card.style.background = colorByType(node.type) + "22"; // subtle transparent background
    card.innerHTML = `
      <div class="node-title">${node.name}</div>
      <div><b>Scientific:</b> ${node.scientific}</div>
      <div><b>Season:</b> ${node.season_note}</div>
      <div><b>Type:</b> ${node.type}</div>
      <div><b>Size:</b> ${node.size}</div>
    `;
    list.appendChild(card);
  });
}

window.drawGraphWithFilters = function(filters) {
  d3.select("#force-map").selectAll("*").remove();

  let filteredNodes = window.treeData.nodes.filter(d => {
    const seasonMatch = filters.season.length === 0 || filters.season.includes(d.season_note);
    const typeMatch = filters.type.length === 0 || filters.type.includes(d.type);
    const sizeMatch = filters.size.length === 0 || filters.size.includes(d.size);
    return seasonMatch && typeMatch && sizeMatch;
  });

  // Update info box with current filtered nodes
  updateInfoBox(filteredNodes);

  const links = createLinks(filteredNodes, filters);

  const container = document.getElementById("force-map");
  const width = container.clientWidth || 960;
  const height = container.clientHeight || 400;

  const isDefault = filters.type.length === 0 && filters.season.length === 0 && filters.size.length === 0;
  const linkDistance = isDefault ? 450 : 200;
  const chargeStrength = isDefault ? -200 : -10;

  const svg = d3.select("#force-map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const zoom = d3.zoom()
    .scaleExtent([0.2, 5])
    .translateExtent([[ -width * 0.5, -height * 0.5 ], [ width * 1.5, height * 1.5 ]])
    .on("zoom", (event) => {
      svg.select("g.zoomable").attr("transform", event.transform);
    });
  svg.call(zoom);

  document.getElementById("force-map").addEventListener("wheel", function(e) {
    if (!e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, { passive: false });

  const zoomable = svg.append("g").attr("class", "zoomable");

  const defs = svg.append("defs");
  links.forEach(link => {
    const sourceNode = filteredNodes.find(n => n.id === (link.source.id || link.source));
    const targetNode = filteredNodes.find(n => n.id === (link.target.id || link.target));
    const gradId = `gradient-link-${sourceNode.id.replace(/[^a-zA-Z0-9]/g, '')}-${targetNode.id.replace(/[^a-zA-Z0-9]/g, '')}`;
    const grad = defs.append("linearGradient")
      .attr("id", gradId)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", 0).attr("x2", 1).attr("y2", 0);
    grad.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", colorByType(sourceNode.type));
    grad.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", colorByType(targetNode.type));
  });

  const linkGroup = zoomable.append("g").attr("class", "links");
  const nodeGroup = zoomable.append("g").attr("class", "nodes");
  const labelGroup = zoomable.append("g").attr("class", "labels");

  let simulation = d3.forceSimulation(filteredNodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(linkDistance).strength(0.7))
    .force("charge", d3.forceManyBody().strength(chargeStrength))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(18));

  // Draw links with gradient
  linkGroup.selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke-width", 1.5)
    .attr("stroke-opacity", 0.9)
    .attr("stroke", d => {
      const sourceId = (d.source.id || d.source).replace(/[^a-zA-Z0-9]/g, '');
      const targetId = (d.target.id || d.target).replace(/[^a-zA-Z0-9]/g, '');
      return `url(#gradient-link-${sourceId}-${targetId})`;
    });

  // Draw nodes
  nodeGroup.selectAll("circle")
    .data(filteredNodes, d => d.id)
    .enter()
    .append("circle")
    .attr("r", 14)
    .attr("fill", d => colorByType(d.type))
    .call(drag(simulation))
    .on("mouseover", function(event, d) {
      d3.select(this)
        .transition()
        .duration(120)
        .attr("r", 14 * 1.08);

      labelGroup.selectAll("text")
        .filter(t => t.id === d.id)
        .transition()
        .duration(120)
        .attr("font-size", "13px");

      d3.select("#tooltip")
        .transition().duration(200).style("opacity", 0.9);
      d3.select("#tooltip")
        .html(`<strong>${d.name}</strong><br/>Scientific: ${d.scientific}<br/>Season: ${d.season_note}<br/>Type: ${d.type}<br/>Size: ${d.size}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(event, d) {
      d3.select(this)
        .transition()
        .duration(120)
        .attr("r", 14);

      labelGroup.selectAll("text")
        .filter(t => t.id === d.id)
        .transition()
        .duration(120)
        .attr("font-size", "12px");

      d3.select("#tooltip")
        .transition().duration(200).style("opacity", 0);
    });

  // Draw labels
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

  const nodeRadius = 14;
  simulation.on("tick", () => {
    // Clamp node positions to stay within the SVG border
    filteredNodes.forEach(d => {
      d.x = Math.max(nodeRadius, Math.min(width - nodeRadius, d.x));
      d.y = Math.max(nodeRadius, Math.min(height - nodeRadius, d.y));
    });

    linkGroup.selectAll("line")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .each(function(d) {
        const sourceId = (d.source.id || d.source).replace(/[^a-zA-Z0-9]/g, '');
        const targetId = (d.target.id || d.target).replace(/[^a-zA-Z0-9]/g, '');
        const grad = svg.select(`#gradient-link-${sourceId}-${targetId}`);
        if (!grad.empty()) {
          grad
            .attr("x1", d.source.x)
            .attr("y1", d.source.y)
            .attr("x2", d.target.x)
            .attr("y2", d.target.y);
        }
      });

    nodeGroup.selectAll("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    labelGroup.selectAll("text")
      .attr("x", d => d.x)
      .attr("y", d => d.y);
  });
};


