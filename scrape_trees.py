import requests
from bs4 import BeautifulSoup
import json
import re
import os

# URL to scrape
URL = "https://khaoyainationalpark.com/en/discover/flora"

def get_tree_data():
    """Scrape tree data from the website"""
    try:
        res = requests.get(URL)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, "html.parser")
    except Exception as e:
        print(f"Error fetching data: {e}")
        return []

    # Find all tree headings
    headings = soup.select("h3, h2")[1:]  # Skip first header which is main "Flora"

    # Get list of actual image files (if TreePic3 folder exists)
    image_dir = "TreePic3"
    image_files = []
    if os.path.exists(image_dir):
        image_files = [f for f in os.listdir(image_dir) 
                      if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp'))]
        print(f"Found {len(image_files)} image files in {image_dir}/")
    else:
        print(f"Warning: {image_dir} directory not found")

    def find_matching_image(tree_name, image_files):
        """Find matching image file for a tree name"""
        if not image_files:
            return None
        
        # Clean tree name for matching
        clean_name = re.sub(r'[^a-zA-Z0-9\s]', '', tree_name.lower())
        clean_name = re.sub(r'\s+', '_', clean_name.strip())
        
        # Try exact matches first
        for img_file in image_files:
            clean_img = re.sub(r'[^a-zA-Z0-9\s]', '', img_file.lower())
            clean_img = re.sub(r'\s+', '_', clean_img.split('.')[0])
            
            if clean_name == clean_img or clean_name in clean_img or clean_img in clean_name:
                return img_file  # Return just the filename
        
        # Try partial matches with words
        name_words = [word for word in clean_name.split('_') if len(word) > 2]
        for img_file in image_files:
            clean_img = re.sub(r'[^a-zA-Z0-9\s]', '', img_file.lower())
            img_words = [word for word in clean_img.split('_') if len(word) > 2]
            
            # Check if any significant word matches
            if any(word in img_words for word in name_words):
                return img_file  # Return just the filename
        
        return None

    def extract_tree_info(desc):
        """Extract tree type and size from description"""
        desc_lower = desc.lower()
        
        # Extract tree type with better categorization
        if re.search(r'\bfrui(t|ting)\b.*\btree\b|\bfruit\b', desc_lower):
            tree_type = "Fruit"
        elif re.search(r'\bevergreen\b', desc_lower):
            tree_type = "Evergreen"
        elif re.search(r'\bdeciduous\b', desc_lower):
            tree_type = "Deciduous"
        elif re.search(r'\bconifer\b|\bpine\b|\bfir\b', desc_lower):
            tree_type = "Coniferous"
        elif re.search(r'\borchid\b', desc_lower):
            tree_type = "Orchid"
        elif re.search(r'\brattan\b', desc_lower):
            tree_type = "Rattan"
        elif re.search(r'\bpalm\b', desc_lower):
            tree_type = "Palm"
        elif re.search(r'\bbamboo\b', desc_lower):
            tree_type = "Bamboo"
        elif re.search(r'\bshrub\b', desc_lower):
            tree_type = "Shrub"
        elif re.search(r'\bvine\b|\bclimber\b|\bclimbing\b', desc_lower):
            tree_type = "Vine"
        elif re.search(r'\bherb\b|\bherbaceous\b', desc_lower):
            tree_type = "Herb"
        elif re.search(r'\btree\b', desc_lower):
            tree_type = "Evergreen"  # Default for any tree
        else:
            # If nothing specific found, categorize by common keywords
            if re.search(r'\bwood\b|\bbark\b|\btrunk\b|\bcanopy\b', desc_lower):
                tree_type = "Evergreen"
            elif re.search(r'\bflower\b|\bblossom\b|\bbloom\b', desc_lower):
                tree_type = "Shrub"
            else:
                tree_type = "Shrub"  # Final fallback
        
        # Extract size
        if re.search(r'\blarge\b|\bbig\b|\btall\b|\bgiant\b|\bmassive\b|\bhuge\b', desc_lower):
            size = "Large"
        elif re.search(r'\bsmall\b|\blittle\b|\btiny\b|\bcompact\b', desc_lower):
            size = "Small"
        elif re.search(r'\bmedium\b|\bmoderate\b', desc_lower):
            size = "Medium"
        else:
            # Default based on type
            if tree_type in ["Evergreen", "Deciduous", "Coniferous", "Fruit"]:
                size = "Large"
            elif tree_type in ["Shrub", "Herb", "Orchid"]:
                size = "Small"
            else:
                size = "Medium"
        
        return tree_type, size

    def extract_season(desc):
        """Extract flowering/fruiting season from description"""
        desc_lower = desc.lower()
        
        if re.search(r'\brainy\s+season\b|\bwet\s+season\b|\bmonsoon\b', desc_lower):
            return "Rainy"
        elif re.search(r'\bdry\s+season\b|\bhot\s+season\b', desc_lower):
            return "Summer"
        elif re.search(r'\bcool\s+season\b|\bwinter\b|\bcold\b', desc_lower):
            return "Winter"
        elif re.search(r'\byear.round\b|\bthroughout\b.*\byear\b|\ball\s+year\b', desc_lower):
            return "Winter"  # Default to winter as most common
        else:
            return "Winter"  # Default

    nodes = []
    processed_names = set()  # Track processed names to avoid duplicates
    
    for h in headings:
        title = h.get_text(strip=True)
        
        # Skip if title is too generic, duplicate, or not a plant name
        if (not title or len(title) < 3 or 
            title.lower() in ['flora', 'plants', 'trees', 'wildlife', 'animals'] or
            title in processed_names):
            continue
        
        processed_names.add(title)
        
        # Get description until next heading
        desc_parts = []
        for sib in h.next_siblings:
            if sib.name in ["h2", "h3"]:
                break
            if sib.name == "p" and sib.get_text(strip=True):
                desc_parts.append(sib.get_text(strip=True))
        
        desc = " ".join(desc_parts)
        
        # Skip if no description found
        if not desc or len(desc) < 20:
            continue
        
        # Extract scientific name (look for italic text first, then patterns)
        sci = ""
        italic_tags = h.find_next_siblings(['em', 'i'])
        if italic_tags:
            potential_sci = italic_tags[0].get_text(strip=True)
            if re.match(r'^[A-Z][a-z]+ [a-z]+', potential_sci):
                sci = potential_sci
        
        if not sci:
            # Look for scientific name patterns in description
            sci_match = re.search(r'\b([A-Z][a-z]+ [a-z]+(?:\s+[a-z]+)?)\b', desc)
            if sci_match:
                sci = sci_match.group(1)
        
        # Extract additional information
        tree_type, size = extract_tree_info(desc)
        season = extract_season(desc)
        
        # Find matching image
        img_filename = find_matching_image(title, image_files)
        
        # Create unique ID
        node_id = re.sub(r'[^a-zA-Z0-9]', '', title.replace(' ', '_'))
        
        # Create node
        node = {
            "id": node_id,
            "name": title,
            "scientific": sci,
            "season_note": season,
            "type": tree_type,
            "size": size,
            "description": desc[:200] + "..." if len(desc) > 200 else desc
        }
        
        # Add image filename if found (just the filename, not the full path)
        if img_filename:
            node["img"] = img_filename  # Just the filename, not the path
            print(f"✓ {title} -> {img_filename}")
        else:
            print(f"✗ {title} -> No image found")
        
        nodes.append(node)

    return nodes

def main():
    """Main function to scrape and save tree data"""
    print("🌳 Starting tree data scraping...")
    print(f"📡 Fetching data from: {URL}")
    
    nodes = get_tree_data()
    
    if not nodes:
        print("❌ No tree data found")
        return
    
    # Create output structure
    output = {
        "nodes": nodes,
        "links": []  # Links will be generated dynamically in JavaScript
    }
    
    # Save to file
    output_file = 'TreeDataWithImg.json'
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Generated {len(nodes)} tree entries")
        print(f"🖼️  Found {len([n for n in nodes if 'img' in n])} matching images")
        print(f"💾 Saved to {output_file}")
        
        # Print sample data
        print(f"\n📋 Sample entries:")
        for i, node in enumerate(nodes[:3]):
            print(f"  {i+1}. {node['name']} ({node['type']}) - {node.get('img', 'No image')}")
            
    except Exception as e:
        print(f"❌ Error saving file: {e}")

if __name__ == "__main__":
    main()