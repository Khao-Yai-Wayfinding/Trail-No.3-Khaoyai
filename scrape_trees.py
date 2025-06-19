import requests
from bs4 import BeautifulSoup
import json
import re
import os

# URL to scrape
URL = "https://khaoyainationalpark.com/en/discover/flora"
res = requests.get(URL)
soup = BeautifulSoup(res.text, "html.parser")

# Find all tree headings
headings = soup.select("h3, h2")[1:]  # first header is main "Flora"

# Get list of actual image files (if TreePic3 folder exists)
image_dir = "TreePic3"
image_files = []
if os.path.exists(image_dir):
    image_files = [f for f in os.listdir(image_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif'))]

def find_matching_image(tree_name, image_files):
    """Find matching image file for a tree name"""
    if not image_files:
        return None
    
    # Clean tree name for matching
    clean_name = tree_name.lower().replace(" ", "_").replace(",", "").replace("(", "").replace(")", "").replace(".", "")
    
    # Try exact matches first
    for img_file in image_files:
        clean_img = img_file.lower().replace(" ", "_").replace(",", "").replace("(", "").replace(")", "").replace(".", "")
        if clean_name in clean_img or clean_img.split('.')[0] in clean_name:
            return f"{image_dir}/{img_file}"
    
    # Try partial matches
    for img_file in image_files:
        img_words = img_file.lower().split('_')
        name_words = clean_name.split('_')
        if any(word in img_words for word in name_words if len(word) > 3):
            return f"{image_dir}/{img_file}"
    
    return None

def extract_tree_info(desc):
    """Extract tree type and size from description"""
    tree_type = ""
    size = ""
    
    # Extract tree type
    if re.search(r"evergreen tree|deciduous tree|tree", desc, re.I):
        if re.search(r"evergreen", desc, re.I):
            tree_type = "Evergreen tree"
        elif re.search(r"deciduous", desc, re.I):
            tree_type = "Deciduous tree"
        else:
            tree_type = "Tree"
    elif re.search(r"palm|rattan|bamboo|shrub|herb|vine|climber", desc, re.I):
        if re.search(r"palm", desc, re.I):
            tree_type = "Palm"
        elif re.search(r"rattan", desc, re.I):
            tree_type = "Rattan"
        elif re.search(r"bamboo", desc, re.I):
            tree_type = "Bamboo"
        elif re.search(r"shrub", desc, re.I):
            tree_type = "Shrub"
        elif re.search(r"herb", desc, re.I):
            tree_type = "Herb"
        elif re.search(r"vine|climber", desc, re.I):
            tree_type = "Vine"
    
    # Extract size
    if re.search(r"large|big|tall|giant|massive", desc, re.I):
        size = "Large"
    elif re.search(r"small|little|tiny", desc, re.I):
        size = "Small"
    elif re.search(r"medium|moderate", desc, re.I):
        size = "Medium"
    else:
        # Default based on type
        if "tree" in tree_type.lower():
            size = "Medium"
        elif tree_type.lower() in ["shrub", "herb"]:
            size = "Small"
        elif tree_type.lower() in ["palm", "bamboo"]:
            size = "Large"
    
    return tree_type, size

def extract_season(desc):
    """Extract flowering/fruiting season from description"""
    season = ""
    
    if re.search(r"rainy season|wet season|july|august|september|october", desc, re.I):
        season = "Rainy"
    elif re.search(r"dry season|hot season|march|april|may", desc, re.I):
        season = "Dry"
    elif re.search(r"cool season|winter|november|december|january|february", desc, re.I):
        season = "Cool"
    elif re.search(r"year.round|throughout|all year", desc, re.I):
        season = "Year-round"
    
    return season

nodes = []
for h in headings:
    title = h.get_text(strip=True)
    
    # Skip if title is too generic or not a plant name
    if not title or len(title) < 3 or title.lower() in ['flora', 'plants', 'trees']:
        continue
    
    # Get description until next heading
    desc = []
    for sib in h.next_siblings:
        if sib.name in ["h2", "h3"]:
            break
        if sib.name == "p":
            desc.append(sib.get_text(strip=True))
    desc = " ".join(desc)
    
    # Extract scientific name
    sci = None
    # Look for scientific name patterns (Genus species)
    sci_match = re.search(r"([A-Z][a-z]+ [a-z]+(?:\s+[a-z]+)?)", desc)
    if sci_match:
        sci = sci_match.group(1)
    
    # Extract additional information
    tree_type, size = extract_tree_info(desc)
    season = extract_season(desc)
    
    # Find matching image
    img_path = find_matching_image(title, image_files)
    
    # Create node
    node = {
        "id": title.replace(" ", "_").replace(",", "").replace("(", "").replace(")", "").replace(".", ""),
        "name": title,
        "scientific": sci or "",
        "season": season,
        "type": tree_type,
        "size": size
    }
    
    # Add image path if found
    if img_path:
        node["img"] = img_path
    
    nodes.append(node)

# Output JSON
output = {"nodes": nodes, "links": []}
print(json.dumps(output, indent=2))

# Also save to file
with open('TreeDataWithImg.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"\n✅ Generated {len(nodes)} tree entries")
print(f"📁 Found {len([n for n in nodes if 'img' in n])} matching images")
print("💾 Saved to TreeDataWithImg.json")