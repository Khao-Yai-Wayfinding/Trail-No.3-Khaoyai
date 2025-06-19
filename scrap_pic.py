import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

html_file_path = r'D:\INDA\Y2\Y2S3\DSB\Trail-No.3-Khaoyai\Trees\Khaoyai_Official_Site.html'
base_url = 'https://khaoyainationalpark.com/en/discover/flora'
images_folder = r'D:\INDA\Y2\Y2S3\DSB\Trail-No.3-Khaoyai\Trees\TreePic3'
os.makedirs(images_folder, exist_ok=True)

with open(html_file_path, 'r', encoding='utf-8') as file:
    soup = BeautifulSoup(file, 'html.parser')

# Step 1: Get tree names and their corresponding section IDs
tree_links = soup.select('ul#nav-scroll-list li a[href^="#content-"]')

for link in tree_links:
    section_id = link['href'].replace('#', '')  # e.g., 'content-2'
    tree_name = link.get_text(strip=True).replace(' ', '_')  # e.g., 'Dipterocarpus_gracilis'

    section = soup.find(id=section_id)
    if not section:
        print(f"Section {section_id} not found.")
        continue

    img_tag = section.find('img')
    if not img_tag:
        print(f"No image found in section {section_id}")
        continue

    img_url = img_tag.get('src')
    if not img_url:
        continue

    full_img_url = urljoin(base_url, img_url)
    file_ext = os.path.splitext(img_url)[-1]
    filename = f"{tree_name}{file_ext}"
    filepath = os.path.join(images_folder, filename)

    try:
        response = requests.get(full_img_url)
        response.raise_for_status()
        with open(filepath, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded: {filename}")
    except Exception as e:
        print(f"Failed to download {full_img_url}: {e}")
