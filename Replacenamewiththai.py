import json
from collections import OrderedDict

# === 1. Load name mapping (English → Thai Pronunciation) ===
name_map = {
    "EagleWood, Agarwood": "Kritsanā",
    "Dipterocarpus gracilis": "Yang Sian",
    "Calamus viminalis (Willd.)": "Wai",
    "Wild Nutmeg": "Chan Thet Pa",
    "Aphanamixis polystachya (Wall.) R. Parker": "Yom Hom",
    "Needlewood": "Kaprao Mai",
    "Magnolia baillonii (Pierre)": "Champi Pa",
    "“Wai Daeng” Renanthera coccinea Lour.": "Wai Daeng",
    "“Samek Khao” Agapetes bracteata Hook. f. ex C. B. Clarke": "Samek Khao",
    "“Moli Siam” (Reevesia pubescens var. siamensis (Craib) Anthony)": "Moli Siam",
    "“Khreua Phu Ngoen” Argyreia mollis (Burm. f.) Choisy": "Khreua Phu Ngoen",
    "“Euang Nam Tarn” Dendrobium heterocarpum Lindl.": "Euang Nam Tarn",
    "Nervilia khaoyaica Suddee (Watthana & S.W. Gale)": "Nervilia Khaoyaica",
    "Scutellaria khaoyaiensis A. J. Paton": "Scutellaria Khaoyaiensis",
    "Polypleurum ubonense": "Polypleurum Ubonense",
    "Monolophus saxicola (K. Larsen) Veldkamp & Mood": "Monolophus Saxicola",
    "“Pobai” Antiaris toxicaria": "Pobai",
    "“Si Siet Thet” Sappanwood": "Si Siet Thet",
    "“Waa” Java Plum": "Waa",
    "“Yang Sian” Dipterocarpus tuberculatus": "Yang Sian",
    "“Por Hu Chang” Hibiscus macrophyllus": "Por Hu Chang",
    "“Sai” Banyan Tree": "Sai",
    "“Luead Kwai” Bischofia javanica": "Luead Kwai",
    "“Tao Ngu Hao” Aristolochia tagala": "Tao Ngu Hao",
    "“Champi Pa” Wild Champak": "Champi Pa",
    "“Yam Hom” Wild Ylang-Ylang": "Yam Hom",
    "“Kaprao Pa” Wild Holy Basil": "Kaprao Pa",
    "“Kritsana” Eaglewood": "Kritsanā",
    "“Nonn Khi Kwai” Acalypha wilkesiana": "Nonn Khi Kwai",
    "Shorea roxburghii": "Yang Na",
    "“Ya Kha” Cogon Grass": "Ya Kha"
}

# === 2. Load JSON ===
with open("TreeDataWithImg.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# === 3. Update each node ===
new_nodes = []
for node in data.get("nodes", []):
    original_name = node.get("name", "")
    thai_pron = name_map.get(original_name)

    if thai_pron:
        # Create new OrderedDict to control field order
        new_node = OrderedDict()
        for k, v in node.items():
            if k == "name":
                new_node["name"] = thai_pron
                new_node["english_name"] = original_name
            else:
                new_node[k] = v
        new_nodes.append(new_node)
    else:
        print(f"⚠️ No Thai pronunciation found for: {original_name}")
        new_nodes.append(node)  # Keep original if no match

# === 4. Overwrite JSON ===
data["nodes"] = new_nodes

with open("TreeDataWithImg.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("✅ Done! 'name' replaced with Thai pronunciation, 'english_name' placed right under 'name'.")
