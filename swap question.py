import tkinter as tk
from tkinter import filedialog, messagebox
import csv
import json

def convert_csv_to_json():
    # 1. Sélection du fichier CSV d'entrée
    input_path = filedialog.askopenfilename(
        title="Sélectionne ton fichier CSV",
        filetypes=(("Fichiers CSV", "*.csv"), ("Tous les fichiers", "*.*"))
    )
    
    if not input_path:
        return # L'utilisateur a annulé

    try:
        data = []
        with open(input_path, 'r', encoding='utf-8') as f:
            # Détection automatique du séparateur (virgule, point-virgule, tabulation...)
            sample = f.read(1024)
            f.seek(0)
            try:
                dialect = csv.Sniffer().sniff(sample)
                reader = csv.reader(f, dialect)
            except csv.Error:
                # Au cas où le sniffer échoue, on force la tabulation (comme dans tes flashcards)
                reader = csv.reader(f, delimiter='\t')
            
            for row in reader:
                if len(row) >= 2:
                    data.append({"q": row[0].strip(), "a": row[1].strip()})

        if not data:
            messagebox.showwarning("Attention", "Aucune donnée n'a été trouvée dans le fichier.")
            return

        # 2. Choix de l'emplacement de sauvegarde du JSON
        output_path = filedialog.asksaveasfilename(
            title="Enregistrer le JSON sous...",
            defaultextension=".json",
            filetypes=(("Fichiers JSON", "*.json"), ("Tous les fichiers", "*.*"))
        )
        
        if not output_path:
            return # L'utilisateur a annulé

        # 3. Écriture du fichier JSON
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
        messagebox.showinfo("Succès", f"Conversion réussie !\nSauvegardé dans :\n{output_path}")
        
    except Exception as e:
        messagebox.showerror("Erreur", f"Une erreur est survenue :\n{e}")

# --- Configuration de l'interface graphique ---
root = tk.Tk()
root.title("Convertisseur Flashcards")
root.geometry("350x150")
root.eval('tk::PlaceWindow . center') # Centre la fenêtre

label = tk.Label(root, text="Transforme ton CSV en { q, a }", font=("Arial", 12), pady=20)
label.pack()

btn = tk.Button(root, text="Choisir un fichier et convertir", command=convert_csv_to_json, font=("Arial", 10), cursor="hand2")
btn.pack()

root.mainloop()