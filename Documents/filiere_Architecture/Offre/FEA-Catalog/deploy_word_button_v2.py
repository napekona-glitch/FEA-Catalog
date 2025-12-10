import os
import re
import sys
import traceback

# Configuration
OFFER_FILES = [
    'fiche-api-management-integration.html',
    'fiche-architecture-data-mesh.html',
    'fiche-audit-qualite-logicielle.html',
    'fiche-ci-cd-industrialisation.html',
    'fiche-infrastructure-as-code.html',
    'fiche-migration-cloud-hybride.html',
    'fiche-mlops-ia-industrielle.html',
    'fiche-modernisation-digital-workplace.html',
    'fiche-monolithe-microservices.html',
    'fiche-observabilite-monitoring.html',
    'fiche-pca-pra-continuite.html',
    'fiche-rag-ia-generative-responsable.html',
    'fiche-sd-wan-sase.html',
    'fiche-zero-trust-iam.html'
]

PDF_FILES = [
    'pdf-api-management-integration.html',
    'pdf-architecture-data-mesh.html',
    'pdf-audit-qualite-logicielle.html',
    'pdf-ci-cd-industrialisation.html',
    'pdf-infrastructure-as-code.html',
    'pdf-migration-cloud-hybride.html',
    'pdf-mlops-ia-industrielle.html',
    'pdf-modernisation-digital-workplace.html',
    'pdf-monolithe-microservices.html',
    'pdf-observabilite-monitoring.html',
    'pdf-pca-pra-continuite.html',
    'pdf-rag-ia-generative-responsable.html',
    'pdf-sd-wan-sase.html',
    'pdf-zero-trust-iam.html'
]

WORD_BUTTON_HTML = """
                <button onclick="downloadAsWord()" class="print-button" style="background: linear-gradient(135deg, #f5a623, #e67e00); color: white; border: none; padding: 12px 24px; border-radius: 25px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(245, 166, 35, 0.3); font-size: 14px; display: inline-flex; align-items: center; gap: 8px;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(245, 166, 35, 0.4)'; this.style.background='linear-gradient(135deg, #e67e00, #f5a623)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(245, 166, 35, 0.3)'; this.style.background='linear-gradient(135deg, #f5a623, #e67e00)';">
                    <i class="fas fa-file-word"></i> Télécharger en Word
                </button>
"""

SCRIPT_TAG = '<script src="JS/html-to-docx.js?v=2"></script>'

def update_offer_files():
    print("Updating Offer Files...")
    for filename in OFFER_FILES:
        try:
            if not os.path.exists(filename):
                print(f"File not found: {filename}")
                continue

            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check if button already exists
            if 'downloadAsWord()' in content:
                print(f"Skipping {filename}: Button already exists")
                continue
                
            # Find the PDF button closing tag
            pattern = r'(<a href="./pdf-[^"]+"\s+target="_blank"\s+class="print-button"[^>]*>.*?</a>)'
            
            if re.search(pattern, content, re.DOTALL):
                # Insert Word button after PDF button
                new_content = re.sub(pattern, r'\1' + WORD_BUTTON_HTML, content, flags=re.DOTALL)
                
                # Add script tag before closing body or end of file
                if '</body>' in new_content:
                    new_content = new_content.replace('</body>', f'    {SCRIPT_TAG}\n</body>')
                else:
                    new_content += f'\n{SCRIPT_TAG}'
                
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filename}")
            else:
                print(f"Warning: PDF button not found in {filename}")
                
        except Exception as e:
            print(f"Error updating {filename}: {str(e)}")
            traceback.print_exc()

def update_pdf_files():
    print("\nUpdating PDF Templates...")
    for filename in PDF_FILES:
        try:
            if not os.path.exists(filename):
                print(f"File not found: {filename}")
                continue

            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace colors
            new_content = content.replace('#667eea', '#f5a623')
            new_content = new_content.replace('#764ba2', '#e67e00')
            
            # Regex replacement for the specific style
            new_content = re.sub(
                r'background:\s*#f8f9fa;\s*border-left:\s*4px\s*solid\s*#f5a623', 
                'background: #fffbf0; border-left: 4px solid #f5a623', 
                new_content
            )
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename}")
            
        except Exception as e:
            print(f"Error updating {filename}: {str(e)}")
            traceback.print_exc()

if __name__ == "__main__":
    print(f"Current working directory: {os.getcwd()}")
    update_offer_files()
    update_pdf_files()
