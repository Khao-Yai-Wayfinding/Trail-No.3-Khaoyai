import os
import re
import json
import datetime
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from PIL import Image
from io import BytesIO

URL = "https://khaoyainationalpark.com/en/discover/fauna/mammals"
IMAGE_DIR = "FaunaPic"
OUTPUT_FILE = "FaunaData.json"

os.makedirs(IMAGE_DIR, exist_ok=True)

def slugify(text):
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return re.sub(r'\s+', '_', text.strip()).lower()

def download_image(img_url, filename):
    try:
        resp = requests.get(img_url, stream=True, timeout=15)
        resp.raise_for_status()
        img = Image.open(BytesIO(resp.content))
        img.save(filename)
        return True
    except Exception as e:
        print(f"Failed to download {img_url}: {e}")
        return False

def fetch_wikipedia_image(mammal_name):
    wiki_url = f"https://en.wikipedia.org/wiki/{mammal_name.replace(' ', '_')}"
    try:
        resp = requests.get(wiki_url, timeout=10)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, 'html.parser')
        infobox = soup.find('table', class_='infobox')
        if infobox:
            img_tag = infobox.find('img')
            if img_tag and img_tag.get('src'):
                img_url = img_tag['src']
                if img_url.startswith('//'):
                    img_url = 'https:' + img_url
                elif img_url.startswith('/'):
                    img_url = urljoin(wiki_url, img_url)
                return img_url
    except Exception as e:
        print(f"Could not fetch Wikipedia image for {mammal_name}: {e}")
    return None

def scrape_mammals():
    # Get the page content
    try:
        resp = requests.get(URL)
        resp.raise_for_status()
    except Exception as e:
        print(f"Failed to fetch mammal page: {e}")
        return []

    soup = BeautifulSoup(resp.text, "html.parser")

    mammals = []
    headers = soup.find_all("h3")
    if not headers:
        print("No mammal headers found on the page.")
        return []

    for h3 in headers:
        name = h3.get_text(strip=True)
        if not name:
            continue

        # Description paragraphs until next h3
        desc_parts = []
        for sib in h3.find_next_siblings():
            if sib.name == "h3":
                break
            if sib.name == "p":
                text = sib.get_text(strip=True)
                if text:
                    desc_parts.append(text)
        description = " ".join(desc_parts)

        # Scientific name detection (italic nearby)
        sci_name = ""
        italic_tag = h3.find_next(['em', 'i'])
        if italic_tag:
            candidate = italic_tag.get_text(strip=True)
            if re.match(r'^[A-Z][a-z]+ [a-z]+', candidate):
                sci_name = candidate
        if not sci_name:
            m = re.search(r'\b([A-Z][a-z]+ [a-z]+)\b', description)
            if m:
                sci_name = m.group(1)

        # Fetch image from Wikipedia
        img_url = fetch_wikipedia_image(name)
        img_filename = None
        if img_url:
            slug = slugify(name)
            img_filename = f"{slug}.jpg"
            img_path = os.path.join(IMAGE_DIR, img_filename)
            if os.path.exists(img_path):
                print(f"Image already downloaded for {name}")
            else:
                if download_image(img_url, img_path):
                    print(f"Downloaded image for {name}")
                else:
                    print(f"Failed to download image for {name}")
                    img_filename = None
        else:
            print(f"No Wikipedia image found for {name}")

        node = {
            "id": slugify(name),
            "name": name,
            "scientific": sci_name,
            "description": description[:300] + ("..." if len(description) > 300 else ""),
            "img": img_filename,
            "_generated_at": datetime.datetime.now().isoformat()
        }
        mammals.append(node)

    return mammals

def main():
    print("Starting mammal data scraping...")
    mammals = scrape_mammals()
    if not mammals:
        print("No mammal data scraped.")
        return

    output = {
        "nodes": mammals,
        "links": []
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"Scraped {len(mammals)} mammals.")
    print(f"Data saved to {OUTPUT_FILE}")
    print(f"Images saved in {IMAGE_DIR}/")

if __name__ == "__main__":
    main()
