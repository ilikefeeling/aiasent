import sys

def convert_to_light_mode():
    with open('style.css', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Replace hardcoded whites with text color
    content = content.replace('#fff', 'var(--text)')
    content = content.replace('#ffffff', 'var(--text)')
    content = content.replace('#FFFFFF', 'var(--text)')
    
    # 2. Replace hardcoded rgba(255,255,255,x) with rgba(0,0,0,x)
    content = content.replace('rgba(255,255,255', 'rgba(0,0,0')
    content = content.replace('rgba(255, 255, 255', 'rgba(0, 0, 0')
    
    # 3. Replace cyan rgb (0,240,255) with new blue (37,99,235) in rgba
    content = content.replace('rgba(0,240,255', 'rgba(37,99,235')
    
    # 4. CTA button text from dark (#080810) to white (#fff) since background is now dark blue
    content = content.replace('color:#080810', 'color:#ffffff')
    
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    convert_to_light_mode()
    print("Done")
