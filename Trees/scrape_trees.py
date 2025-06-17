import requests
from bs4 import BeautifulSoup
import json
import re

# URL to scrape
URL = "https://khaoyainationalpark.com/en/discover/flora"
res = requests.get(URL)
soup = BeautifulSoup(res.text, "html.parser")

# Find all tree headings
headings = soup.select("h3, h2")[1:]  # first header is main "Flora"

nodes = []
for h in headings:
    title = h.get_text(strip=True)
    # description until next heading
    desc = []
    for sib in h.next_siblings:
        if sib.name in ["h2", "h3"]:
            break
        if sib.name == "p":
            desc.append(sib.get_text(strip=True))
    desc = " ".join(desc)
    # Extract scientific names and season clues
    sci = None
    m = re.search(r"([A-Z][a-z]+ [a-z]+)", desc)
    if m:
        sci = m.group(1)
    season = None
    if re.search(r"hot season|dry season|May|June|February|April", desc, re.I):
        season = "Season-clue-present"
    nodes.append({
        "id": title.replace(" ", "_"),
        "name": title,
        "scientific": sci,
        "season_note": season or "",
        "type": "",  # to fill manually
        "size": ""   # to fill manually
    })

# Output JSON
print(json.dumps({"nodes": nodes, "links": []}, indent=2))
