// Color mapping for tree types - Updated palette
function colorByType(type) {
  if (!type) return "#4a5568"; // Dark gray
  
  const typeStr = type.toLowerCase();
  
  // Greenish-bluish tones with pink and yellow accents
  if (typeStr.includes('deciduous')) return "#2d7d9a"; // Blue-green
  if (typeStr.includes('evergreen')) return "#22543d"; // Deep green
  if (typeStr.includes('fruit')) return "#f6e05e"; // Soft yellow
  if (typeStr.includes('conifer')) return "#2c5282"; // Deep blue
  if (typeStr.includes('rattan')) return "#38a169"; // Medium green
  if (typeStr.includes('orchid')) return "#d53f8c"; // Pink accent
  if (typeStr.includes('shrub')) return "#319795"; // Teal
  if (typeStr.includes('vine') || typeStr.includes('climber')) return "#4fd1c7"; // Light teal
  if (typeStr.includes('herb')) return "#68d391"; // Light green
  if (typeStr.includes('palm')) return "#ed8936"; // Warm orange (less harsh)
  if (typeStr.includes('bamboo')) return "#9ae6b4"; // Very light green
  if (typeStr.includes('tree')) return "#2f855a"; // Forest green
  
  console.log(`⚠️  Unmapped type: "${type}" -> using default gray`);
  return "#4a5568"; // Default gray
}

function sanitizeId(id) {
  return id.replace(/[^a-zA-Z0-9]/g, '');
}

function createLinks(nodes, filters) {
  const links = [];
  const noFilter = filters.type.length === 0 && filters.season.length === 0 && filters.size.length === 0;
  
  if (noFilter) {
    // Connect all nodes when no filters are active
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        links.push({ source: nodes[i].id, target: nodes[j].id });
      }
    }
  } else {
    // Connect nodes based on shared attributes
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
      // On mobile, don't stick nodes after dragging
      if (window.innerWidth < 768) {
        d.fx = null;
        d.fy = null;
      }
    });
}

function updateInfoBox(nodes) {
  const list = document.getElementById("nodeInfoList");
  if (!list) return;
  
  list.innerHTML = "";

  if (!nodes.length) {
    list.innerHTML = "<div style='color:#aaa; text-align: center; padding: 20px;'>No matching trees found.</div>";
    return;
  }

  nodes.forEach(node => {
    const card = document.createElement("div");
    card.className = "node-info-card";
    card.setAttribute("data-id", node.id);
    card.style.borderColor = colorByType(node.type);
    card.style.background = colorByType(node.type) + "22";
    
    // Create the main title (always visible)
    const titleDiv = document.createElement("div");
    titleDiv.className = "node-title";
    titleDiv.textContent = node.name;
    titleDiv.style.fontWeight = "bold";
    
    // Create details container (hidden by default)
    const detailsDiv = document.createElement("div");
    detailsDiv.className = "node-details";
    
    // Add image if exists
    if (node.img) {
      const img = document.createElement("img");
      img.className = "tree-img";
      
      // Handle both cases: with or without TreePic3/ prefix
      let imagePath = node.img;
      if (imagePath.startsWith('TreePic3/')) {
        img.src = imagePath;
      } else {
        img.src = `TreePic3/${imagePath}`;
      }
      
      img.alt = node.name;
      
      // Add error handling - silently handle missing images
      img.onerror = function() {
        this.style.display = "none";
        // Don't show error placeholder, just hide the image
      };
      
      img.onload = function() {
        console.log(`✓ Successfully loaded: ${this.src}`);
      };
      
      detailsDiv.appendChild(img);
    }
    
    // Add other details
    const details = [
      { label: "Scientific", value: node.scientific },
      { label: "Season", value: node.season_note },
      { label: "Type", value: node.type },
      { label: "Size", value: node.size }
    ];
    
    details.forEach(detail => {
      if (detail.value) {
        const detailElement = document.createElement("div");
        detailElement.innerHTML = `<b>${detail.label}:</b> ${detail.value}`;
        detailElement.style.marginBottom = "4px";
        detailsDiv.appendChild(detailElement);
      }
    });
    
    // Add description if available
    if (node.description) {
      const descElement = document.createElement("div");
      descElement.innerHTML = `<b>Description:</b> ${node.description}`;
      descElement.style.marginBottom = "4px";
      descElement.style.fontSize = "6px";
      descElement.style.lineHeight = "1.4";
      detailsDiv.appendChild(descElement);
    }
    
    // Assemble the card
    card.appendChild(titleDiv);
    card.appendChild(detailsDiv);
    list.appendChild(card);
  });
}

// Debug function to check image loading and types
function debugImagePaths(nodes) {
  console.log("=== Debug Info ===");
  console.log(`Total nodes: ${nodes.length}`);
  
  const nodesWithImages = nodes.filter(n => n.img);
  console.log(`Nodes with images: ${nodesWithImages.length}`);
  
  // Get all unique types
  const types = [...new Set(nodes.map(n => n.type).filter(t => t))];
  console.log(`Unique types found: ${types.join(', ')}`);
  
  // Show type distribution
  const typeCount = {};
  nodes.forEach(n => {
    const type = n.type || 'undefined';
    typeCount[type] = (typeCount[type] || 0) + 1;
  });
  console.log('Type distribution:', typeCount);
  
  console.log("==================");
}

// Main drawing function
window.drawGraphWithFilters = function (filters) {
  // Clear previous graph
  d3.select("#force-map").selectAll("*").remove();

  if (!window.TreeData || !window.TreeData.nodes) {
    console.log("TreeData not loaded yet, showing loading message...");
    const container = document.getElementById("force-map");
    container.innerHTML = `
      <div style="
        display: flex; 
        align-items: center; 
        justify-content: center; 
        height: 100%; 
        color: white; 
        font-family: 'Courier New', monospace;
        text-align: center;
        flex-direction: column;
      ">
        <div style="font-size: 18px; margin-bottom: 10px;">🌳 Loading Flora Data</div>
        <div style="font-size: 14px;">Please wait<span class="loading-text"></span></div>
      </div>
    `;
    return;
  }

  // Filter nodes based on selected filters
  const filteredNodes = window.TreeData.nodes.filter(d => {
    const seasonMatch = !filters.season.length || filters.season.includes(d.season_note);
    const typeMatch = !filters.type.length || filters.type.includes(d.type);
    const sizeMatch = !filters.size.length || filters.size.includes(d.size);
    return seasonMatch && typeMatch && sizeMatch;
  });

  console.log(`Filtered to ${filteredNodes.length} nodes from ${window.TreeData.nodes.length} total`);

  // Create links between filtered nodes
  const links = createLinks(filteredNodes, filters);
  
  // Update info box
  updateInfoBox(filteredNodes);

  // Get container dimensions
  const container = document.getElementById("force-map");
  const width = container.clientWidth || 960;
  const height = container.clientHeight || 500;

  // Create SVG
  const svg = d3.select("#force-map")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Create zoomable group
  const zoomable = svg.append("g").attr("class", "zoomable");
  
  // Add zoom behavior with limits - no initial zoom
  const zoom = d3.zoom()
    .scaleExtent([1, 5])  // Limit zoom: 30% to 300%
    .translateExtent([[-width * 2, -height * 2], [width * 3, height * 3]])  // Limit pan
    .on("zoom", (event) => {
      zoomable.attr("transform", event.transform);
    });
  
  svg.call(zoom);
  
  // Create gradient definitions for links
  const defs = svg.append("defs");
  links.forEach(link => {
    const sourceNode = filteredNodes.find(n => n.id === (link.source.id || link.source));
    const targetNode = filteredNodes.find(n => n.id === (link.target.id || link.target));
    
    if (sourceNode && targetNode) {
      const gradId = `gradient-link-${sanitizeId(sourceNode.id)}-${sanitizeId(targetNode.id)}`;
      const grad = defs.append("linearGradient")
        .attr("id", gradId)
        .attr("gradientUnits", "userSpaceOnUse");
      grad.append("stop").attr("offset", "0%").attr("stop-color", colorByType(sourceNode.type));
      grad.append("stop").attr("offset", "100%").attr("stop-color", colorByType(targetNode.type));
    }
  });

  // Create groups for different elements
  const linkGroup = zoomable.append("g").attr("class", "links");
  const nodeGroup = zoomable.append("g").attr("class", "nodes");
  const labelGroup = zoomable.append("g").attr("class", "labels");

  // Create force simulation with better initial positioning
  const simulation = d3.forceSimulation(filteredNodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(350).strength(0.8)) // Even more distance
    .force("charge", d3.forceManyBody().strength(-400)) // Even more repulsion
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(26)) // Even more collision radius
    .force("x", d3.forceX(width / 2).strength(0.1))
    .force("y", d3.forceY(height / 2).strength(0.1));

  // Create links with thinner styling
  const linkElements = linkGroup.selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke-width", 1.5) // Thinner lines
    .attr("stroke-opacity", d => {
      // Determine which filter this link matches
      const sourceNode = filteredNodes.find(n => n.id === (d.source.id || d.source));
      const targetNode = filteredNodes.find(n => n.id === (d.target.id || d.target));
      if (!sourceNode || !targetNode) return 0.5;

      // Type filter
      if (
        filters.type.length &&
        sourceNode.type === targetNode.type &&
        filters.type.includes(sourceNode.type)
      ) {
        return 1.0;
      }
      // Season filter
      if (
        filters.season.length &&
        sourceNode.season_note === targetNode.season_note &&
        filters.season.includes(sourceNode.season_note)
      ) {
        return 0.7;
      }
      // Size filter
      if (
        filters.size.length &&
        sourceNode.size === targetNode.size &&
        filters.size.includes(sourceNode.size)
      ) {
        return 0.5;
      }
      // Default
      return 0.5;
    })
    .attr("stroke", d => {
      const sourceId = sanitizeId(d.source.id || d.source);
      const targetId = sanitizeId(d.target.id || d.target);
      return `url(#gradient-link-${sourceId}-${targetId})`;
    });

  // Create tooltip
  const tooltip = d3.select("#tooltip");

  // Create nodes with proper colors and thinner styling
  const nodeElements = nodeGroup.selectAll("circle")
    .data(filteredNodes, d => d.id)
    .enter()
    .append("circle")
    .attr("r", 12) // Smaller radius
    .attr("fill", d => colorByType(d.type))  // Ensure color is applied
    .attr("stroke", "#fff")
    .attr("stroke-width", 0.5) // Thinner stroke
    .style("cursor", "pointer")
    .call(drag(simulation))
    .on("mouseover", (event, d) => {
      tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);
      tooltip.html(`
        <strong>${d.name}</strong><br/>
        <em>${d.scientific || 'Unknown'}</em><br/>
        Type: ${d.type}<br/>
        Season: ${d.season_note}<br/>
        Size: ${d.size}
      `)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px");
    })
    .on("mouseout", () => {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    })
    .on("click", (event, d) => {
      // Remove previous selections
      document.querySelectorAll(".node-info-card").forEach(card => 
        card.classList.remove("selected-info-card"));
      
      // Select the clicked node's info card
      const infoCard = document.querySelector(`.node-info-card[data-id="${d.id}"]`);
      if (infoCard) {
        infoCard.classList.add("selected-info-card");
        
        // Check if mobile (screen width < 768px)
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
          // On mobile, scroll to the info section
          const infoBox = document.querySelector('.info-box');
          if (infoBox) {
            infoBox.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } else {
          // On desktop, scroll within the info list
          infoCard.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      
      // NO NEW WINDOW - just expand the info card
      event.stopPropagation();
    });

  // Clear selections when clicking on empty space
  svg.on("click", () => {
    document.querySelectorAll(".node-info-card").forEach(card => 
      card.classList.remove("selected-info-card"));
  });

  // Create labels with customizable font size
  const labelElements = labelGroup.selectAll("text")
    .data(filteredNodes)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .attr("fill", "#fff")
    .attr("font-size", "5px") // 🔧 CHANGE THIS VALUE to adjust font size
    .attr("font-family", "Courier New, monospace")
    .attr("pointer-events", "none")
    .style("text-shadow", "1px 1px 1px rgba(0,0,0,0.8)")
    .text(d => d.name.length > 8 ? d.name.substring(0, 8) + "..." : d.name); // Also shortened text length

  // Update positions on simulation tick
  simulation.on("tick", () => {
    // Constrain nodes to stay within bounds with smaller radius
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

  // Add click handlers to info cards with mobile support
  setTimeout(() => {
    document.querySelectorAll('.node-info-card').forEach(card => {
      card.addEventListener('click', function() {
        // Remove previous selections
        document.querySelectorAll('.node-info-card').forEach(c => 
          c.classList.remove('selected-info-card'));
        
        // Select this card
        this.classList.add('selected-info-card');
        
        // Highlight corresponding node
        const nodeId = this.getAttribute('data-id');
        const node = filteredNodes.find(n => n.id === nodeId);
        if (node) {
          // Temporarily highlight the node in the graph
          const nodeElement = nodeElements.filter(d => d.id === nodeId);
          nodeElement.transition()
            .duration(300)
            .attr("r", 24)
            .attr("stroke-width", 4)
            .transition()
            .duration(300)
            .attr("r", 16)
            .attr("stroke-width", 2);
        }
      });
    });
  }, 100);

  // Reset simulation function
  window.resetSimulation = () => {
    filteredNodes.forEach(d => {
      d.fx = null;
      d.fy = null;
    });
    simulation.alpha(1).restart();
  };

  console.log(`Graph created with ${filteredNodes.length} nodes and ${links.length} links`);
};

// Load the data and initialize
console.log("🌳 Initializing Flora Map...");

// Set a flag to track loading state
window.TreeDataLoaded = false;

d3.json("TreeDataWithImg.json").then(data => {
  console.log("✅ Tree data loaded successfully");
  window.TreeData = data;
  window.TreeDataLoaded = true;
  
  // Debug the loaded data
  console.log("📊 Loaded tree data:", data);
  console.log(`🌲 Total trees: ${data.nodes.length}`);
  debugImagePaths(data.nodes);
  
  // Initial draw with no filters
  drawGraphWithFilters({ type: [], season: [], size: [] });
  
  // Update info box to show we're ready
  const infoList = document.getElementById("nodeInfoList");
  if (infoList && infoList.innerHTML.includes("Loading")) {
    updateInfoBox(data.nodes);
  }
  
}).catch(error => {
  console.error("❌ Error loading tree data:", error);
  window.TreeDataLoaded = false;
  
  // Show error message in the graph area
  const container = document.getElementById("force-map");
  container.innerHTML = `
    <div style="
      display: flex; 
      align-items: center; 
      justify-content: center; 
      height: 100%; 
      color: #ff6b6b; 
      font-family: 'Courier New', monospace;
      text-align: center;
      flex-direction: column;
    ">
      <div style="font-size: 18px; margin-bottom: 10px;">⚠️ Error Loading Data</div>
      <div style="font-size: 14px;">Could not load TreeDataWithImg.json</div>
      <div style="font-size: 12px; margin-top: 10px; color: #999;">
        Make sure you've run the Python scraper first:<br/>
        <code>python scrape_trees.py</code>
      </div>
    </div>
  `;
  
  // Show error in info box too
  const infoList = document.getElementById("nodeInfoList");
  if (infoList) {
    infoList.innerHTML = `
      <div style="color: #ff6b6b; text-align: center; padding: 20px;">
        <div>❌ Failed to load tree data</div>
        <div style="font-size: 12px; margin-top: 8px; color: #999;">
          Run: <code>python scrape_trees.py</code><br/>
          Then refresh this page
        </div>
      </div>
    `;
  }
});

// Export functions for potential external use
window.TreeGraphUtils = {
  colorByType,
  sanitizeId,
  debugImagePaths,
  resetSimulation: () => window.resetSimulation && window.resetSimulation()
};