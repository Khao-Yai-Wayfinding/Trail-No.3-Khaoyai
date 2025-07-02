// Integrated Flora-Fauna Graph System
// Replace your existing graph.js with this

// ========== FLORA-FAUNA RELATIONSHIP DATA ==========
// This defines which animals are associated with which plants
const FLORA_FAUNA_RELATIONSHIPS = {
  // Flora ID -> Array of Fauna IDs that interact with this plant
  'EagleWoodAgarwood': ['asian_elephant', 'sambar_deer', 'barking_deer_muntjac'],
  'Dipterocarpusgracilis': ['asian_elephant', 'gaur', 'black_giant_squirrel'],
  'CalamusviminalisWilld': ['asian_elephant', 'malayan_porcupine'],
  'WildNutmeg': ['black_giant_squirrel', 'binturong'],
  'AphanamixispolystachyaWallRParker': ['sambar_deer', 'barking_deer_muntjac'],
  'Needlewood': ['lar_gibbon_whitehanded_gibbon', 'pileated_gibbon'],
  'MagnoliabailloniiPierre': ['asian_black_bear', 'binturong'],
  'WaiDaengRenantheracoccineaLour': ['lar_gibbon_whitehanded_gibbon'],
  'SamekKhaoAgapetesbracteataHookfexCBClarke': ['northern_pigtailed_macaque'],
  'MoliSiamReevesiapubescensvarsiamensisCraibAnthony': ['asian_black_bear'],
  'KhreuaPhuNgoenArgyreiamollisBurmfChoisy': ['smooth_coated_otter'],
  'EuangNamTarnDendrobiumheterocarpumLindl': ['northern_slow_loris'],
  'NerviliakhaoyaicaSuddeeWatthanaSWGale': ['leopard_cat'],
  'ScutellariakhaoyaiensisAJPaton': ['serow'],
  'Polypleurumubonense': ['smooth_coated_otter'],
  'MonolophussaxicolaKLarsenVeldkampMood': ['dhole']
};

// Timeline assignment for flora species (you can adjust these manually)
const TIMELINE_ASSIGNMENTS = {
  // Section 0 (0 km) - nodes 0-4
  0: ['EagleWoodAgarwood', 'Dipterocarpusgracilis'],
  1: ['CalamusviminalisWilld'],
  2: ['WildNutmeg'],
  3: ['AphanamixispolystachyaWallRParker'],
  4: ['Needlewood'],
  
  // Section 1 (0.5 km) - nodes 5-9
  5: ['MagnoliabailloniiPierre'],
  6: ['WaiDaengRenantheracoccineaLour'],
  7: ['SamekKhaoAgapetesbracteataHookfexCBClarke'],
  8: ['MoliSiamReevesiapubescensvarsiamensisCraibAnthony'],
  9: ['KhreuaPhuNgoenArgyreiamollisBurmfChoisy'],
  
  // Section 2 (1.5 km) - nodes 10-14
  10: ['EuangNamTarnDendrobiumheterocarpumLindl'],
  11: ['NerviliakhaoyaicaSuddeeWatthanaSWGale'],
  12: ['ScutellariakhaoyaiensisAJPaton'],
  13: ['Polypleurumubonense'],
  14: ['MonolophussaxicolaKLarsenVeldkampMood'],
  
  // Continue pattern for remaining sections...
  15: ['PobaiAntiarisToxicaria', 'SappanwoodCaesalpiniaSappan'],
  16: ['JavaPlumSyzygiumCumini'],
  17: ['YangSianDipterocarpusTuberculatus'],
  18: ['PorHuChangHibiscusMacrophyllus'],
  19: ['SaiFicusBenghalensis'],
  
  20: ['LueadKwaiBischofiaJavanica'],
  21: ['TaoNguHaoAristolochiaTagala'],
  22: ['ChampiPaMagnoliaHimalayana'],
  23: ['YamHomCanangaLatifolia'],
  24: ['KapraoPaOcimumGratissimum'],
  
  25: ['KritsanaAquilariaCrassna'],
  26: ['NonnKhiKwaiAcalyphaWilkesiana'],
  27: ['ShoreaRoxburghii'],
  28: ['YaKhaImperataCylindrica'],
  29: []
};

// Color schemes
const CATEGORY_COLORS = {
  'Flora': '#22c55e',
  'Fauna': '#ef4444',
  'Trees': '#16a34a', 
  'Shrubs': '#15803d',
  'Herbs': '#65a30d',
  'Vines': '#84cc16',
  'Orchids': '#d946ef',
  'Fruits': '#f59e0b',
  'Large Mammals': '#dc2626',
  'Small Mammals': '#b91c1c',
  'Primates': '#991b1b',
  'Carnivores': '#f97316',
  'Herbivores': '#64748b'
};

const SPECIES_COLORS = {
  // Flora types
  'Evergreen': '#22543d',
  'Deciduous': '#2d7d9a', 
  'Fruit': '#f6e05e',
  'Orchid': '#d53f8c',
  'Shrub': '#319795',
  'Vine': '#4fd1c7',
  'Herb': '#68d391',
  'Flowering tree': '#ed8936',
  'Grass': '#9ae6b4',
  
  // Fauna types
  'elephant': '#a0522d',
  'bear': '#5a3e1b', 
  'cat': '#d2691e',
  'gibbon': '#6495ed',
  'deer': '#9acd32',
  'squirrel': '#ff8c00',
  'otter': '#20b2aa',
  'porcupine': '#8b4513',
  'macaque': '#daa520',
  'binturong': '#708090',
  'dhole': '#dc143c',
  'gaur': '#8b4513',
  'serow': '#696969',
  'loris': '#dda0dd'
};

function getSpeciesColor(node) {
  if (node.category === 'Flora') {
    return SPECIES_COLORS[node.type] || '#4a5568';
  } else {
    const name = node.name.toLowerCase();
    for (const [animal, color] of Object.entries(SPECIES_COLORS)) {
      if (name.includes(animal)) {
        return color;
      }
    }
    return '#4a5568';
  }
}

function categorizeFloraData(floraNodes) {
  return floraNodes.map(node => ({
    ...node,
    category: 'Flora',
    nodeType: 'species',
    animalType: getFloraAnimalType(node),
    radius: 8
  }));
}

function getFloraAnimalType(node) {
  // Categorize flora based on what animals typically interact with them
  const type = node.type?.toLowerCase() || '';
  const name = node.name.toLowerCase();
  
  if (type.includes('fruit') || name.includes('fruit')) return 'Herbivore';
  if (type.includes('orchid')) return 'Small Mammal';
  if (type.includes('herb') || type.includes('grass')) return 'Herbivore';
  if (type.includes('vine')) return 'Primate';
  if (type.includes('evergreen') || type.includes('deciduous')) return 'Large Mammal';
  return 'Herbivore';
}

function categorizeFaunaData(faunaNodes) {
  return faunaNodes.map(node => {
    const enhancedNode = {
      ...node,
      category: 'Fauna', 
      nodeType: 'species',
      animalType: getFaunaAnimalType(node),
      radius: 8
    };
    return enhancedNode;
  });
}

function getFaunaAnimalType(node) {
  const name = node.name.toLowerCase();
  
  if (name.includes('elephant') || name.includes('gaur')) return 'Large Mammal';
  if (name.includes('gibbon') || name.includes('macaque') || name.includes('loris')) return 'Primate';
  if (name.includes('cat') || name.includes('leopard') || name.includes('dhole')) return 'Carnivore';
  if (name.includes('bear')) return 'Carnivore';
  if (name.includes('deer') || name.includes('sambar') || name.includes('muntjac') || name.includes('serow')) return 'Herbivore';
  return 'Small Mammal';
}

function createFloraFaunaLinks(floraNodes, faunaNodes) {
  const links = [];
  
  // Create relationships based on FLORA_FAUNA_RELATIONSHIPS
  Object.entries(FLORA_FAUNA_RELATIONSHIPS).forEach(([floraId, faunaIds]) => {
    const floraNode = floraNodes.find(n => n.id === floraId);
    if (floraNode) {
      faunaIds.forEach(faunaId => {
        const faunaNode = faunaNodes.find(n => n.id === faunaId);
        if (faunaNode) {
          links.push({
            source: floraNode.id,
            target: faunaNode.id,
            type: 'floraFaunaLink',
            relationship: 'ecological'
          });
        }
      });
    }
  });
  
  // Add additional links based on animal types
  floraNodes.forEach(flora => {
    faunaNodes.forEach(fauna => {
      if (flora.animalType === fauna.animalType && Math.random() < 0.1) {
        // 10% chance of additional connection based on similar ecological niches
        links.push({
          source: flora.id,
          target: fauna.id,
          type: 'ecologicalLink',
          relationship: 'habitat'
        });
      }
    });
  });
  
  return links;
}

function createCategoryNodes(floraData, faunaData, mode = 'integrated') {
  const nodes = [];
  const links = [];
  
  if (mode === 'integrated') {
    // Main category nodes
    const floraMain = {
      id: 'category-Flora',
      name: 'Flora',
      nodeType: 'mainCategory',
      category: 'Flora',
      radius: 25,
      x: 300,
      y: 250
    };
    
    const faunaMain = {
      id: 'category-Fauna', 
      name: 'Fauna',
      nodeType: 'mainCategory',
      category: 'Fauna',
      radius: 25,
      x: 700,
      y: 250
    };
    
    nodes.push(floraMain, faunaMain);
    
    // Sub-category nodes for flora
    const floraTypes = [...new Set(floraData.map(n => n.animalType))];
    floraTypes.forEach((type, index) => {
      const subNode = {
        id: `flora-${type}`,
        name: type,
        nodeType: 'subCategory',
        category: 'Flora',
        radius: 15,
        count: floraData.filter(n => n.animalType === type).length
      };
      nodes.push(subNode);
      
      links.push({
        source: floraMain.id,
        target: subNode.id,
        type: 'categoryLink'
      });
      
      // Link species to sub-categories
      floraData.filter(n => n.animalType === type).forEach(species => {
        links.push({
          source: subNode.id,
          target: species.id,
          type: 'speciesLink'
        });
      });
    });
    
    // Sub-category nodes for fauna
    const faunaTypes = [...new Set(faunaData.map(n => n.animalType))];
    faunaTypes.forEach((type, index) => {
      const subNode = {
        id: `fauna-${type}`,
        name: type,
        nodeType: 'subCategory',
        category: 'Fauna',
        radius: 15,
        count: faunaData.filter(n => n.animalType === type).length
      };
      nodes.push(subNode);
      
      links.push({
        source: faunaMain.id,
        target: subNode.id,
        type: 'categoryLink'
      });
      
      // Link species to sub-categories
      faunaData.filter(n => n.animalType === type).forEach(species => {
        links.push({
          source: subNode.id,
          target: species.id,
          type: 'speciesLink'
        });
      });
    });
    
    // Connect similar sub-categories between flora and fauna
    floraTypes.forEach(floraType => {
      faunaTypes.forEach(faunaType => {
        if (floraType === faunaType) {
          links.push({
            source: `flora-${floraType}`,
            target: `fauna-${faunaType}`,
            type: 'crossCategoryLink'
          });
        }
      });
    });
  }
  
  return { categoryNodes: nodes, categoryLinks: links };
}

function applyFilters(data, filters) {
  let filtered = [...data];
  
  if (filters.category && filters.category.length > 0) {
    filtered = filtered.filter(node => filters.category.includes(node.category));
  }
  
  if (filters.type && filters.type.length > 0) {
    filtered = filtered.filter(node => {
      if (node.category === 'Flora') {
        return filters.type.includes(node.type) || filters.type.includes(node.animalType);
      } else {
        return filters.type.includes(node.animalType);
      }
    });
  }
  
  if (filters.season && filters.season.length > 0 && node.season_note) {
    filtered = filtered.filter(node => filters.season.includes(node.season_note));
  }
  
  if (filters.size && filters.size.length > 0 && node.size) {
    filtered = filtered.filter(node => filters.size.includes(node.size));
  }
  
  return filtered;
}

// Main drawing function
window.drawIntegratedGraph = function(filters = {}, containerSelector = "#force-map") {
  const container = document.querySelector(containerSelector);
  
  // Clear previous graph
  d3.select(containerSelector).selectAll("*").remove();
  
  // Check if data is loaded
  if (!window.TreeData || !window.FaunaData) {
    container.innerHTML = `<div style="color:#fff; font-family: monospace; padding:20px; text-align:center;">Loading data...</div>`;
    return;
  }
  
  // Prepare data
  const categorizedFlora = categorizeFloraData(window.TreeData.nodes);
  const categorizedFauna = categorizeFaunaData(window.FaunaData.nodes);
  
  // Apply filters
  const filteredFlora = applyFilters(categorizedFlora, filters);
  const filteredFauna = applyFilters(categorizedFauna, filters);
  
  // Create category structure
  const categoryStructure = createCategoryNodes(filteredFlora, filteredFauna, filters.mode);
  
  // Create flora-fauna relationships
  const floraFaunaLinks = createFloraFaunaLinks(filteredFlora, filteredFauna);
  
  // Combine all data
  const allNodes = [
    ...categoryStructure.categoryNodes,
    ...filteredFlora,
    ...filteredFauna
  ];
  
  const allLinks = [
    ...categoryStructure.categoryLinks,
    ...floraFaunaLinks
  ];
  
  // Update info box with both flora and fauna
  updateInfoBox([...filteredFlora, ...filteredFauna]);
  
  // Set up visualization
  const width = container.clientWidth || 960;
  const height = container.clientHeight || 500;
  
  const svg = d3.select(containerSelector)
    .append("svg")
    .attr("width", width)
    .attr("height", height);
    
  const zoomable = svg.append("g").attr("class", "zoomable");
  
  const zoom = d3.zoom()
    .scaleExtent([0.3, 3])
    .on("zoom", (event) => {
      zoomable.attr("transform", event.transform);
    });
  svg.call(zoom);
  
  // Create force simulation
  const simulation = d3.forceSimulation(allNodes)
    .force("link", d3.forceLink(allLinks)
      .id(d => d.id)
      .distance(d => {
        if (d.type === 'categoryLink') return 100;
        if (d.type === 'speciesLink') return 60;
        if (d.type === 'floraFaunaLink') return 150;
        if (d.type === 'crossCategoryLink') return 200;
        return 80;
      })
      .strength(d => {
        if (d.type === 'categoryLink') return 0.8;
        if (d.type === 'speciesLink') return 0.6;
        if (d.type === 'floraFaunaLink') return 0.4;
        if (d.type === 'crossCategoryLink') return 0.3;
        return 0.5;
      })
    )
    .force("charge", d3.forceManyBody()
      .strength(d => {
        if (d.nodeType === 'mainCategory') return -1000;
        if (d.nodeType === 'subCategory') return -500;
        return -150;
      })
    )
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide()
      .radius(d => d.radius + 8)
    );
  
  // Create links
  const links = zoomable.selectAll(".link")
    .data(allLinks)
    .enter().append("line")
    .attr("class", "link")
    .attr("stroke", d => {
      if (d.type === 'categoryLink') return '#666';
      if (d.type === 'speciesLink') return '#999';
      if (d.type === 'floraFaunaLink') return '#22c55e';
      if (d.type === 'crossCategoryLink') return '#1e90ff';
      return '#ccc';
    })
    .attr("stroke-width", d => {
      if (d.type === 'categoryLink') return 3;
      if (d.type === 'floraFaunaLink') return 2;
      if (d.type === 'crossCategoryLink') return 2;
      return 1;
    })
    .attr("stroke-opacity", d => {
      if (d.type === 'floraFaunaLink') return 1.5;
      if (d.type === 'crossCategoryLink') return 0.5;
      return 0.6;
    })
    .attr("stroke-dasharray", d => {
      if (d.type === 'floraFaunaLink') return "5,5";
      if (d.type === 'crossCategoryLink') return "3,3";
      return "none";
    });
  
  // Create nodes
  const nodes = zoomable.selectAll(".node")
    .data(allNodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", d => d.radius)
    .attr("fill", d => {
      if (d.nodeType === 'mainCategory') return CATEGORY_COLORS[d.name];
      if (d.nodeType === 'subCategory') return CATEGORY_COLORS[d.name] || CATEGORY_COLORS[d.category];
      return getSpeciesColor(d);
    })
    .attr("stroke", d => {
      if (d.category === 'Flora') return '#22c55e';
      if (d.category === 'Fauna') return '#ef4444';
      return '#fff';
    })
    .attr("stroke-width", d => {
      if (d.nodeType === 'mainCategory') return 3;
      if (d.nodeType === 'subCategory') return 2;
      return 1;
    })
    .style("cursor", "pointer")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged) 
      .on("end", dragended)
    );
  
  // Add labels
  const labels = zoomable.selectAll(".label")
    .data(allNodes)
    .enter().append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .attr("fill", "#fff")
    .attr("font-size", d => {
      if (d.nodeType === 'mainCategory') return "12px";
      if (d.nodeType === 'subCategory') return "8px";
      return "6px";
    })
    .attr("font-weight", d => {
      if (d.nodeType === 'mainCategory') return "bold";
      if (d.nodeType === 'subCategory') return "bold";
      return "normal";
    })
    .style("pointer-events", "none")
    .style("text-shadow", "1px 1px 1px rgba(0,0,0,0.8)")
    .text(d => {
      if (d.nodeType === 'mainCategory') return d.name;
      if (d.nodeType === 'subCategory') return `${d.name} (${d.count})`;
      return d.name.length > 6 ? d.name.substring(0, 6) + "..." : d.name;
    });
  
  // Add tooltips and interactions
  const tooltip = d3.select("#tooltip");
  
  nodes
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 0.9);
      
      let tooltipContent = `<strong>${d.name}</strong><br/>`;
      if (d.nodeType === 'species') {
        tooltipContent += `<em>${d.scientific || 'Unknown'}</em><br/>`;
        tooltipContent += `Category: ${d.category}<br/>`;
        if (d.type) tooltipContent += `Type: ${d.type}<br/>`;
        if (d.animalType) tooltipContent += `Animal Type: ${d.animalType}<br/>`;
        if (d.season_note) tooltipContent += `Season: ${d.season_note}`;
      } else if (d.nodeType === 'subCategory') {
        tooltipContent += `${d.count} species`;
      }
      
      tooltip.html(tooltipContent)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().duration(500).style("opacity", 0);
    })
    .on("click", (event, d) => {
      if (d.nodeType === 'species') {
        updateInfoBox([...filteredFlora, ...filteredFauna], d.id);
        event.stopPropagation();
      }
    });
  
  // Simulation tick
  simulation.on("tick", () => {
    allNodes.forEach(d => {
      d.x = Math.max(d.radius, Math.min(width - d.radius, d.x));
      d.y = Math.max(d.radius, Math.min(height - d.radius, d.y));
    });
    
    links
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
      
    nodes
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
      
    labels
      .attr("x", d => d.x)
      .attr("y", d => d.y);
  });
  
  // Drag functions
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    if (window.innerWidth < 768) {
      d.fx = null;
      d.fy = null;
    }
  }
  
  console.log(`✅ Integrated graph: ${allNodes.length} nodes, ${allLinks.length} links`);
  console.log(`🌳 Flora: ${filteredFlora.length}, 🦁 Fauna: ${filteredFauna.length}`);
};

// Update info box to show both flora and fauna
function updateInfoBox(nodes, selectedId = null) {
  const list = document.getElementById("nodeInfoList");
  if (!list) return;
  list.innerHTML = "";

  if (!nodes.length) {
    list.innerHTML = `<div style="color:#aaa; text-align:center; padding:20px;">No species found.</div>`;
    return;
  }

  // Sort by category (Flora first, then Fauna)
  const sortedNodes = nodes.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category === 'Flora' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  sortedNodes.forEach(node => {
    const card = document.createElement("div");
    card.className = "node-info-card";
    card.setAttribute("data-id", node.id);
    card.style.borderColor = getSpeciesColor(node);
    card.style.background = getSpeciesColor(node) + "22";

    const titleDiv = document.createElement("div");
    titleDiv.className = "node-title";
    
    // Add category indicator
    const indicator = document.createElement("span");
    indicator.className = `category-indicator ${node.category.toLowerCase()}`;
    titleDiv.appendChild(indicator);
    titleDiv.appendChild(document.createTextNode(node.name));
    titleDiv.style.fontWeight = "bold";

    const detailsDiv = document.createElement("div");
    detailsDiv.className = "node-details";
    detailsDiv.style.display = (selectedId === node.id) ? "block" : "none";

    // Add image
    if (node.img && typeof node.img === "string" && node.img.trim() !== "") {
      const img = document.createElement("img");
      img.className = "tree-img";
      
      const imgPath = node.category === 'Flora' ? 
        (node.img.startsWith('TreePic3/') ? node.img : `TreePic3/${node.img}`) :
        (node.img.startsWith('FaunaPic/') ? node.img : `FaunaPic/${node.img}`);
      
      img.src = imgPath;
      img.alt = node.name;
      img.onerror = function() { this.style.display = "none"; };
      detailsDiv.appendChild(img);
    }

    const details = [
      { label: "Scientific", value: node.scientific },
      { label: "Category", value: node.category },
      { label: "Type", value: node.type },
      { label: "Animal Type", value: node.animalType },
      { label: "Season", value: node.season_note },
      { label: "Size", value: node.size }
    ];

    details.forEach(({ label, value }) => {
      if (value && value !== node.category) {
        const div = document.createElement("div");
        div.innerHTML = `<b>${label}:</b> ${value}`;
        div.style.marginBottom = "4px";
        detailsDiv.appendChild(div);
      }
    });

    if (node.description) {
      const descElement = document.createElement("div");
      descElement.innerHTML = `<b>Description:</b> ${node.description.substring(0, 150)}...`;
      descElement.style.marginBottom = "4px";
      descElement.style.fontSize = "11px";
      descElement.style.lineHeight = "1.3";
      detailsDiv.appendChild(descElement);
    }

    card.appendChild(titleDiv);
    card.appendChild(detailsDiv);
    list.appendChild(card);
  });

  // Add click handlers
  setTimeout(() => {
    document.querySelectorAll('.node-info-card').forEach(card => {
      card.addEventListener('click', function() {
        document.querySelectorAll('.node-info-card').forEach(c => 
          c.classList.remove('selected-info-card'));
        this.classList.add('selected-info-card');
        
        if (window.innerWidth < 768) {
          this.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    });
  }, 100);
}

// Replace original function
window.drawGraphWithFilters = function(filters) {
  window.drawIntegratedGraph(filters);
};

// Load data and initialize
Promise.all([
  d3.json("TreeDataWithImg.json"),
  d3.json("FaunaData.json")
]).then(([treeData, faunaData]) => {
  console.log("✅ Flora and Fauna data loaded successfully");
  window.TreeData = treeData;
  window.FaunaData = faunaData;
  window.TreeDataLoaded = true;
  
  console.log(`🌳 Flora: ${treeData.nodes.length} species`);
  console.log(`🦁 Fauna: ${faunaData.nodes.length} species`);
  
  // Initial draw
  drawIntegratedGraph({ mode: 'integrated' });
  
}).catch(error => {
  console.error("❌ Error loading data:", error);
  const container = document.getElementById("force-map");
  container.innerHTML = `<div style="color: #ff6b6b; text-align: center; padding: 20px;">Failed to load data</div>`;
});

// Export for timeline integration
window.TIMELINE_ASSIGNMENTS = TIMELINE_ASSIGNMENTS;