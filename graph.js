// ========== TIMELINE ASSIGNMENTS ==========
const TIMELINE_ASSIGNMENTS = {
  '0km-0.5km': ['Kenny and Maki', 'Needlewood', 'PobaiAntiarisToxicaria'],
  '0.5km-1.5km': ['Mimi', 'Nut', 'SaiFicusBenghalensis'], 
  '1.5km-2.5km': ['Tangmo'],
  '2.5km-3.5km': ['Bel_and_Mag', 'ObservationTower', 'Salt_lick', 'Nori'],
  '3.5km-3.9km': ['YaKhaImperataCylindrica']
};

// ========== FLORA-FAUNA RELATIONSHIP DATA ==========
const FLORA_FAUNA_RELATIONSHIPS = {
  'EagleWoodAgarwood': ['asian_elephant', 'sambar_deer', 'barking_deer_muntjac'],
  'Dipterocarpusgracilis': ['asian_elephant', 'gaur', 'black_giant_squirrel'],
  'CalamusviminalisWilld': ['asian_elephant', 'malayan_porcupine'],
  'WildNutmeg': ['black_giant_squirrel', 'binturong'],
  'AphanamixispolystachyaWallRParker': ['sambar_deer', 'barking_deer_muntjac'],
  'Needlewood': ['lar_gibbon_white_handed_gibbon', 'pileated_gibbon'],
  'MagnoliabailloniiPierre': ['asian_black_bear', 'binturong'],
  'WaiDaengRenantheracoccineaLour': ['lar_gibbon_white_handed_gibbon'],
  'SamekKhaoAgapetesbracteataHookfexCBClarke': ['northern_pig_tailed_macaque'],
  'MoliSiamReevesiapubescensvarsiamensisCraibAnthony': ['asian_black_bear'],
  'KhreuaPhuNgoenArgyreiamollisBurmfChoisy': ['smooth_coated_otter'],
  'EuangNamTarnDendrobiumheterocarpumLindl': ['northern_slow_loris'],
  'NerviliakhaoyaicaSuddeeWatthanaSWGale': ['leopard_cat'],
  'ScutellariakhaoyaiensisAJPaton': ['serow'],
  'Polypleurumubonense': ['smooth_coated_otter'],
  'MonolophussaxicolaKLarsenVeldkampMood': ['dhole']
};

// ========== COLOR SCHEMES ==========
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
  'Highlight': '#24fbed',
  
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

// ========== UTILITY FUNCTIONS ==========
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

function createPlaceholderImage(category, name) {
  const placeholder = document.createElement('div');
  placeholder.style.cssText = `
    width: 100%;
    height: 120px;
    background: ${category === 'Flora' ? '#22c55e20' : '#ef444420'};
    border: 1px dashed ${category === 'Flora' ? '#22c55e' : '#ef4444'};
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 11px;
    margin: 6px 0;
    text-align: center;
    line-height: 1.3;
  `;
  placeholder.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 4px;">${category}</div>
    <div style="font-size: 10px;">${name}</div>
  `;
  return placeholder;
}

function createRealImage(node) {
  const img = document.createElement("img");
  img.className = "tree-img";
  
  // Skip if no image specified
  if (!node.img || node.img.trim() === '') {
    console.log('📷 No image specified for:', node.name);
    return createPlaceholderImage(node.category, node.name);
  }
  
  // Smart image path detection
  let imgPath = node.img;
  if (node.category === 'Fauna') {
    imgPath = imgPath.includes('/') ? imgPath : 'FaunaPic/' + imgPath;
  } else {
    imgPath = imgPath.includes('/') ? imgPath : 'TreePic3/' + imgPath;
  }
  
  console.log('🖼️ Loading image:', imgPath, 'for', node.name);
  
  img.src = imgPath;
  img.alt = node.name;
  
  // Enhanced fallback system
  let fallbackAttempts = 0;
  img.onerror = function() {
    fallbackAttempts++;
    console.log(`❌ Image load failed (attempt ${fallbackAttempts}):`, this.src);
    
    if (node.category === 'Fauna' && fallbackAttempts === 1) {
      // Try AnimalPic folder
      const newPath = imgPath.replace('FaunaPic/', 'AnimalPic/');
      console.log('🔄 Trying AnimalPic folder:', newPath);
      this.src = newPath;
      return;
    }
    
    // Final fallback - replace with placeholder
    console.log('🎨 Using placeholder for:', node.name);
    const placeholder = createPlaceholderImage(node.category, node.name);
    this.parentNode.replaceChild(placeholder, this);
  };
  
  // Success handler
  img.onload = function() {
    console.log('✅ Image loaded:', imgPath);
  };
  
  return img;
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
  
  // Add some random ecological links
  floraNodes.forEach(flora => {
    faunaNodes.forEach(fauna => {
      if (flora.animalType === fauna.animalType && Math.random() < 0.1) {
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
  
  if (filters.season && filters.season.length > 0) {
    filtered = filtered.filter(node => filters.season.includes(node.season_note));
  }
  
  if (filters.size && filters.size.length > 0) {
    filtered = filtered.filter(node => filters.size.includes(node.size));
  }
  
  return filtered;
}

// ========== MAIN DRAWING FUNCTION ==========
window.drawIntegratedGraph = function(filters = {}, containerSelector = "#force-map") {
  const container = document.querySelector(containerSelector);
  
  // Clear previous graph
  d3.select(containerSelector).selectAll("*").remove();
  
  // Check if data is loaded
  if (!window.TreeData || !window.FaunaData) {
    container.innerHTML = `<div style="color:#fff; font-family: monospace; padding:20px; text-align:center;">Loading data...</div>`;
    return;
  }
  
  // Debug timeline assignments when data is available
  debugTimelineAssignments(window.TreeData.nodes, window.FaunaData.nodes);
  
  // Prepare data
  const categorizedFlora = categorizeFloraData(window.TreeData.nodes);
  const categorizedFauna = categorizeFaunaData(window.FaunaData.nodes);
  
  // Apply filters
  const filteredFlora = applyFilters(categorizedFlora, filters);
  const filteredFauna = applyFilters(categorizedFauna, filters);
  
  // Create flora-fauna relationships
  const floraFaunaLinks = createFloraFaunaLinks(filteredFlora, filteredFauna);
  
  // Combine all data
  const allNodes = [
    ...filteredFlora,
    ...filteredFauna
  ];
  
  const allLinks = [
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
        if (d.type === 'floraFaunaLink') return 150;
        if (d.type === 'ecologicalLink') return 80;
        return 100;
      })
      .strength(d => {
        if (d.type === 'floraFaunaLink') return 0.4;
        if (d.type === 'ecologicalLink') return 0.3;
        return 0.5;
      })
    )
    .force("charge", d3.forceManyBody()
      .strength(d => -200)
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
      if (d.type === 'floraFaunaLink') return '#22c55e';
      if (d.type === 'ecologicalLink') return '#1e90ff';
      return '#ccc';
    })
    .attr("stroke-width", d => {
      if (d.type === 'floraFaunaLink') return 2;
      return 1;
    })
    .attr("stroke-opacity", d => {
      if (d.type === 'floraFaunaLink') return 0.8;
      return 0.6;
    })
    .attr("stroke-dasharray", d => {
      if (d.type === 'floraFaunaLink') return "5,5";
      return "none";
    });
  
  // Create nodes
  const nodes = zoomable.selectAll(".node")
    .data(allNodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", d => d.radius)
    .attr("fill", d => CATEGORY_COLORS[d.category] || getSpeciesColor(d))
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .call(drag(simulation));
  
  // Add node labels
  const labels = zoomable.selectAll(".label")
    .data(allNodes)
    .enter().append("text")
    .attr("class", "label")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .attr("font-size", 9)
    .attr("pointer-events", "none")
    .text(d => d.name.length > 10 ? d.name.substring(0, 10) + "..." : d.name);
  
  simulation.on("tick", () => {
    links
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
    
    nodes
      .attr("cx", d => d.x = Math.max(d.radius, Math.min(width - d.radius, d.x)))
      .attr("cy", d => d.y = Math.max(d.radius, Math.min(height - d.radius, d.y)));
    
    labels
      .attr("x", d => d.x)
      .attr("y", d => d.y - d.radius - 6);
  });
  
  // Drag handlers
  function drag(simulation) {
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
      d.fx = null;
      d.fy = null;
    }
    
    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }
  
  // Info box update function
  function updateInfoBox(data) {
    const infoBox = document.querySelector("#nodeInfoList");
    if (!infoBox) return;
    
    infoBox.innerHTML = "";

    if (!data.length) {
      infoBox.innerHTML = '<div style="color:#aaa; text-align:center; padding:20px;">No species found.<br><small style="font-size:11px; margin-top:8px; display:block;">Try adjusting filters or timeline selection</small></div>';
      return;
    }

    // Sort by category (Flora first, then Fauna) and then by name
    const sortedNodes = data.sort((a, b) => {
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

      const titleDiv = document.createElement("div");
      titleDiv.className = "node-title";
      
      // Add category indicator
      const indicator = document.createElement("span");
      indicator.className = 'category-indicator ' + (node.category ? node.category.toLowerCase() : 'flora');
      titleDiv.appendChild(indicator);
      titleDiv.appendChild(document.createTextNode(node.name));

      const detailsDiv = document.createElement("div");
      detailsDiv.className = "node-details";
      detailsDiv.style.display = "none";

      // Add image with enhanced fallback system and better debugging
      if (node.img && typeof node.img === "string" && node.img.trim() !== "") {
        console.log('Processing image for:', node.name, 'image file:', node.img);
        const imageElement = createRealImage(node);
        detailsDiv.appendChild(imageElement);
      } else {
        // No image specified, create placeholder
        console.log('No image specified for:', node.name, 'creating placeholder');
        const placeholder = createPlaceholderImage(node.category, node.name);
        detailsDiv.appendChild(placeholder);
      }

      const details = [
        { label: "English Name", value: node.english_name },
        { label: "Scientific", value: node.scientific },
        { label: "Category", value: node.category },
        { label: "Type", value: node.type },
        { label: "Season", value: node.season_note },
        { label: "Size", value: node.size }
      ];

      details.forEach(detail => {
        if (detail.value && detail.value !== node.category && detail.value !== node.name) {
          const div = document.createElement("div");
          div.innerHTML = '<b>' + detail.label + ':</b> ' + detail.value;
          div.style.marginBottom = "4px";
          div.style.fontSize = "12px";
          detailsDiv.appendChild(div);
        }
      });

      if (node.description) {
        const descElement = document.createElement("div");
        descElement.innerHTML = '<b>Description:</b> ' + node.description.substring(0, 200) + '...';
        descElement.style.marginBottom = "4px";
        descElement.style.fontSize = "11px";
        descElement.style.lineHeight = "1.3";
        detailsDiv.appendChild(descElement);
      }

      card.appendChild(titleDiv);
      card.appendChild(detailsDiv);
      infoBox.appendChild(card);

      // Add click handler for each card
      card.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Remove selection from all cards
        document.querySelectorAll('.node-info-card').forEach(c => {
          c.classList.remove('selected-info-card');
          const details = c.querySelector('.node-details');
          if (details) details.style.display = 'none';
        });
        
        // Add selection to clicked card
        this.classList.add('selected-info-card');
        const thisDetails = this.querySelector('.node-details');
        if (thisDetails) {
          thisDetails.style.display = 'block';
          
          // Smooth scroll to show the expanded card
          setTimeout(() => {
            if (window.innerWidth <= 768) {
              // Mobile: scroll the expanded card into view
              card.scrollIntoView({ 
                behavior: "smooth", 
                block: "start"
              });
            } else {
              // Desktop: center the card
              card.scrollIntoView({ 
                behavior: "smooth", 
                block: "center"
              });
            }
          }, 100);
        }
        
        console.log('Forest inventory card clicked:', this.getAttribute('data-id'));
      });
    });
  }
};