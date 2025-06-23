import json
import os

def fix_json_paths():
    """Fix the double path issue in existing JSON file"""
    
    # Read the existing JSON file
    try:
        with open('TreeDataWithImg.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("❌ TreeDataWithImg.json not found")
        return
    except Exception as e:
        print(f"❌ Error reading JSON: {e}")
        return
    
    # Fix image paths
    fixed_count = 0
    for node in data['nodes']:
        if 'img' in node and node['img']:
            original_path = node['img']
            # Remove TreePic3/ prefix if it exists
            if node['img'].startswith('TreePic3/'):
                node['img'] = node['img'][9:]  # Remove 'TreePic3/' (9 characters)
                fixed_count += 1
                print(f"✓ Fixed: {node['name']}")
                print(f"  Before: {original_path}")
                print(f"  After:  {node['img']}")
    
    # Save the fixed JSON
    try:
        with open('TreeDataWithImg.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"\n✅ Fixed {fixed_count} image paths")
        print("💾 Updated TreeDataWithImg.json")
        
        # Show sample of fixed data
        print(f"\n📋 Sample entries after fix:")
        for i, node in enumerate(data['nodes'][:3]):
            img_info = node.get('img', 'No image')
            print(f"  {i+1}. {node['name']} -> {img_info}")
            
    except Exception as e:
        print(f"❌ Error saving file: {e}")

if __name__ == "__main__":
    print("🔧 Fixing image paths in JSON file...")
    fix_json_paths()
    print("\n🔄 Please refresh your browser after this fix!")