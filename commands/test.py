import os
import sys
import json
import requests
from typing import Dict, Any
from dotenv import load_dotenv

# Carica le variabili d'ambiente
load_dotenv()

def validate_api_url() -> str:
    """Verifica che l'URL base dell'API sia configurato e valido."""
    api_url = os.getenv('VITE_API_URL')
    if not api_url:
        print("❌ Errore: VITE_API_URL non configurato nel file .env")
        sys.exit(1)
    return api_url.rstrip('/')

def test_endpoint(url: str, endpoint: str, method: str = 'GET', data: Dict[str, Any] = None) -> None:
    """Testa un endpoint specifico e logga il risultato."""
    full_url = f"{url}/{endpoint.lstrip('/')}"
    try:
        response = requests.request(method, full_url, json=data)
        status_code = response.status_code
        
        # Log colorato basato sullo status code
        if 200 <= status_code < 300:
            print(f"✅ {method} {endpoint} - Status: {status_code}")
        elif 300 <= status_code < 400:
            print(f"⚠️ {method} {endpoint} - Status: {status_code} (Redirect)")
        elif 400 <= status_code < 500:
            print(f"❌ {method} {endpoint} - Status: {status_code} (Client Error)")
        else:
            print(f"💥 {method} {endpoint} - Status: {status_code} (Server Error)")
            
        # Prova a decodificare la risposta JSON
        try:
            response_data = response.json()
            print(f"   Response: {json.dumps(response_data, indent=2)}")
        except json.JSONDecodeError:
            print(f"   Response: {response.text[:200]}...")
            
    except requests.RequestException as e:
        print(f"💥 Errore nella richiesta a {endpoint}: {str(e)}")

def main():
    """Funzione principale per i test degli endpoint."""
    api_url = validate_api_url()
    
    # Lista degli endpoint da testare
    endpoints = [
        ('health', 'GET'),
        ('auth/status', 'GET'),
        ('users/profile', 'GET'),
        # Aggiungi altri endpoint qui
    ]
    
    print("\n🔍 Inizio test degli endpoint...\n")
    
    for endpoint, method in endpoints:
        test_endpoint(api_url, endpoint, method)
    
    print("\n✅ Health check fix applicato")

if __name__ == "__main__":
    main() 