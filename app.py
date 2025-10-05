# app.py
import os, requests
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

# ---- Config ----
OLLAMA_HOST  = os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma2:2b")  # pequeño y liviano

PROMPT_SYSTEM = (
    "Eres 'Gaia', una IA educativa (12-17 años) para conciencia ecológica. "
    "1) Preséntate y pregunta sobre prevención (incendios en Isla Canguro, Australia). "
    "2) Responde con 'qué hubiera pasado si...': validación/efectividad → consecuencias positivas → cambio en la historia. "
    "3) Cierra con una pregunta de seguimiento. Lenguaje claro, positivo, sin tecnicismos."
)

app = Flask(__name__, template_folder="templates")
CORS(app, resources={r"/*": {"origins": "*"}})
app.logger.setLevel("INFO")

def clamp_history(history, max_turns=6, max_chars=700):
    """Recorta historial para no ahogar al modelo en RAM/tiempo."""
    out = []
    for m in history[-max_turns:]:
        out.append({
            "role": "user" if m.get("role") == "user" else "assistant",
            "content": (m.get("text") or "")[:max_chars]
        })
    return out

def call_ollama_chat(messages):
    """Llama a Ollama /api/chat (no streaming)."""
    url = f"{OLLAMA_HOST}/api/chat"
    payload = {
        "model": OLLAMA_MODEL,
        "messages": messages,
        "stream": False,
        "options": {
            "temperature": 0.7,
            "num_ctx": 512,       # bajo consumo RAM para tu equipo
            "top_p": 0.9
        }
    }
    r = requests.post(url, json=payload, timeout=120)
    r.raise_for_status()
    data = r.json()
    return (data.get("message", {}) or {}).get("content", "").strip()

@app.route("/__health")
def health():
    try:
        info = requests.get(f"{OLLAMA_HOST}/api/tags", timeout=5).json()
        models = [m.get("name") for m in info.get("models", [])]
        return jsonify({"status": "ok", "host": OLLAMA_HOST, "model": OLLAMA_MODEL, "models": models})
    except Exception as e:
        return jsonify({"status": "no-ollama", "error": str(e), "host": OLLAMA_HOST, "model": OLLAMA_MODEL})

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(silent=True) or {}
        user_message = (data.get("message") or "").strip()
        history = clamp_history(data.get("history", []))

        if not user_message:
            return jsonify({"error": "No se proporcionó ningún mensaje."}), 400

        # Construye turnos para Ollama
        messages = [{"role": "system", "content": PROMPT_SYSTEM}]
        messages.extend(history)
        messages.append({"role": "user", "content": user_message})

        try:
            reply = call_ollama_chat(messages)
            if not reply:
                reply = "Lo siento, no pude generar respuesta. ¿Puedes intentar con otra formulación?"
            return jsonify({"reply": reply})
        except requests.exceptions.ConnectionError:
            return jsonify({"reply": "⚠️ No me puedo conectar a Ollama. ¿Está corriendo 'ollama serve'? (o servicio activo)"}), 503
        except requests.HTTPError as e:
            return jsonify({"reply": f"⚠️ Error al llamar al modelo '{OLLAMA_MODEL}': {e}"}), 502

    except Exception as e:
        app.logger.exception("Error en /chat")
        return jsonify({"error": f"Ocurrió un error en backend: {e}"}), 500

if __name__ == "__main__":
    # Asegúrate: 1) 'ollama serve' está corriendo, 2) 'ollama pull gemma2:2b'
    app.run(host="0.0.0.0", port=5000, debug=True)
