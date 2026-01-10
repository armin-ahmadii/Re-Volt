import os
import socket
import psutil
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from google import genai
from google.genai import types



app = Flask(__name__)
CORS(app)

# --- Helper Functions ---

def get_ip_address():
    """Finds the local IP address of the machine."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # doesn't even have to be reachable
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

def get_system_stats():
    """Collects system telemetry: CPU, RAM, and Temperature."""
    cpu_usage = psutil.cpu_percent(interval=None)
    ram_usage = psutil.virtual_memory().percent
    
    # Try to get CPU temperature
    cpu_temp = 45.0 # Fallback
    try:
        temps = psutil.sensors_temperatures()
        if 'coretemp' in temps:
            cpu_temp = temps['coretemp'][0].current
        elif 'cpu_thermal' in temps: # Raspberry Pi often uses this
             cpu_temp = temps['cpu_thermal'][0].current
        # Add more platform specific checks if needed
    except Exception:
        pass # Keep fallback
        
    return {
        "cpu_usage": cpu_usage,
        "ram_usage": ram_usage,
        "cpu_temp": cpu_temp,
        "ip_address": get_ip_address()
    }

# --- Routes ---

@app.route('/stats', methods=['GET'])
def stats():
    """Returns system telemetry as JSON."""
    return jsonify(get_system_stats())

@app.route('/generate', methods=['POST'])
def generate():
    """Generates legacy-safe HTML using Gemini."""
    data = request.json
    device_name = data.get('device_name', 'Legacy Device')
    os_version = data.get('os_version', 'Unknown OS')
    
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        return jsonify({"error": "GEMINI_API_KEY/GOOGLE_API_KEY not found"}), 500

    client = genai.Client(api_key=api_key)
    
    local_ip = get_ip_address()
    
    prompt = f"""
    Generate a single-file index.html for a device named "{device_name}" running "{os_version}".
    
    Legacy Constraints:
    1. Use ONLY var in JavaScript (no arrow functions, no const/let).
    2. Use ONLY Flexbox for CSS (no Grid).
    3. The JS must use XMLHttpRequest to fetch from http://{local_ip}:5000/stats every 1000ms.
    4. Style it with a 'Cyberpunk' dark theme using neon green #00FF41.
    5. Display the stats (CPU, RAM, Temp) clearly.
    
    Return ONLY the raw HTML string. Do not include markdown code blocks.
    """
    
    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )
        
        generated_html = response.text
        # Clean up if Gemini returns markdown code blocks despite instructions
        if generated_html.startswith("```html"):
            generated_html = generated_html[7:]
        if generated_html.startswith("```"):
             generated_html = generated_html[3:]
        if generated_html.endswith("```"):
            generated_html = generated_html[:-3]
            
        # Save to file for /display route
        with open("generated_dashboard.html", "w") as f:
            f.write(generated_html)
            
        return jsonify({"html": generated_html})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/identify', methods=['POST'])
def identify():
    """Identifies tech waste and provides recycling advice using Gemini."""
    import base64
    import json
    
    data = request.json
    image_data = data.get('image')
    additional_info = data.get('additional_info', '')
    
    if not image_data:
        return jsonify({"error": "No image provided"}), 400
        
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    
    # Mock response for testing if no API key is provided
    if not api_key:
        print("WARNING: No GEMINI_API_KEY found. Returning mock data for demonstration.")
        mock_data = {
            "device_type": "Mock Desktop Computer",
            "model": "Generic 90s PC",
            "release_year": "1998",
            "recyclability_score": 85,
            "toxic_materials": ["Lead in solder", "Mercury in clock battery"],
            "nearest_disposal_steps": [
                "Remove the hard drive for data destruction.",
                "Take motherboard to e-waste recycling center.",
                "Steel case can be scrapped as metal."
            ]
        }
        return jsonify(mock_data)
        
    client = genai.Client(api_key=api_key)
    
    # helper to clean base64
    mime_type = "image/jpeg" # Default
    if "data:" in image_data and ";base64," in image_data:
        header, image_data = image_data.split(";base64,")
        mime_type = header.split(":")[1]
        
    try:
        image_bytes = base64.b64decode(image_data)
        
        prompt = f"""
        You are a Circular Economy Expert. Analyze the provided image of a tech device.
        Additional Context: {additional_info}
        
        Task:
        1. Identify the device type and model.
        2. Assess its recyclability (0-100 score).
        3. Identify any toxic materials (e.g., battery type, heavy metals).
        4. Provide specific steps for responsible disposal or recycling.
        
        Output valid JSON with keys:
        - device_type (string)
        - model (string)
        - release_year (string)
        - recyclability_score (integer)
        - toxic_materials (array of strings)
        - nearest_disposal_steps (array of strings)
        """
        
        response = client.models.generate_content(
            model="gemini-1.5-pro",
            contents=[
                prompt,
                types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
            ],
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        
        return jsonify(json.loads(response.text))
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/display', methods=['GET'])
def display():
    """Serves the generated HTML."""
    try:
        with open("generated_dashboard.html", "r") as f:
            content = f.read()
        return Response(content, mimetype='text/html')
    except FileNotFoundError:
        return "No dashboard generated yet. Please call /generate first.", 404

if __name__ == '__main__':
    ip = get_ip_address()
    print(f"--- Re-Volt Backend Running ---")
    print(f"Local IP: {ip}")
    print(f"Stats Endpoint: http://{ip}:5000/stats")
    print(f"Display Endpoint: http://{ip}:5000/display")
    print(f"-------------------------------")
    app.run(host='0.0.0.0', port=5000)
