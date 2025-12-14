
# json_to_excel.py
import json
import sys
import pandas as pd

def json_to_excel(json_path: str, xlsx_path: str, sheet_name: str = "Données"):
    """
    Convertit un fichier JSON en Excel (.xlsx).
    - Gère JSON: liste d'objets [{...}, {...}] ou objet unique {...}
    - Aplatissement des champs imbriqués via json_normalize
    """
    # Lire le JSON
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Normaliser en DataFrame
    if isinstance(data, list):
        # Liste d'objets → lignes
        df = pd.json_normalize(data, max_level=None)
    elif isinstance(data, dict):
        # Objet unique → une ligne
        df = pd.json_normalize(data, max_level=None)
    else:
        raise ValueError("Format JSON inattendu: doit être un objet ou une liste d'objets.")

    # Écrire en Excel
    with pd.ExcelWriter(xlsx_path, engine="openpyxl") as writer:
        df.to_excel(writer, sheet_name=sheet_name, index=False)

    print(f"✅ Fichier Excel créé: {xlsx_path}  ({len(df)} lignes, {len(df.columns)} colonnes)")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python json_to_excel.py <input.json> <output.xlsx> [sheet_name]")
        sys.exit(1)

    input_json = sys.argv[1]
    output_xlsx = sys.argv[2]
    sheet = sys.argv[3] if len(sys.argv) >= 4 else "Données"
    json_to_excel(input_json, output_xlsx, sheet)
