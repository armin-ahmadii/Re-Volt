import unittest
import json
from unittest.mock import patch, MagicMock
from app import app

class TestReVoltBackend(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_stats_endpoint(self):
        response = self.app.get('/stats')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('cpu_usage', data)
        self.assertIn('ram_usage', data)
        self.assertIn('cpu_temp', data)
        self.assertIsInstance(data['cpu_usage'], float)
        self.assertIsInstance(data['ram_usage'], float)
        # Temp can be float or int depending on fallback
        self.assertTrue(isinstance(data['cpu_temp'], (float, int)))

    @patch('app.genai.Client')
    @patch('os.environ.get')
    def test_generate_endpoint_mock(self, mock_env, mock_genai_client):
        # Mock API Key
        mock_env.return_value = "FAKE_API_KEY"
        
        # Mock Gemini Response
        mock_response = MagicMock()
        mock_response.text = "<html><body>Mock Dashboard</body></html>"
        
        mock_model = MagicMock()
        mock_model.generate_content.return_value = mock_response
        
        mock_client_instance = MagicMock()
        mock_client_instance.models = mock_model
        
        mock_genai_client.return_value = mock_client_instance

        payload = {
            "device_name": "Test Device",
            "os_version": "Test OS"
        }
        
        response = self.app.post('/generate', 
                                 data=json.dumps(payload),
                                 content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn('html', data)
        self.assertEqual(data['html'], "<html><body>Mock Dashboard</body></html>")

    def test_display_endpoint_no_file(self):
        # Ensure no file exists
        import os
        if os.path.exists("generated_dashboard.html"):
            os.remove("generated_dashboard.html")
            
        response = self.app.get('/display')
        self.assertEqual(response.status_code, 404)

    def test_display_endpoint_with_file(self):
        with open("generated_dashboard.html", "w") as f:
            f.write("<html>Test Content</html>")
            
        response = self.app.get('/display')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.decode('utf-8'), "<html>Test Content</html>")
        
        # Cleanup
        import os
        if os.path.exists("generated_dashboard.html"):
            os.remove("generated_dashboard.html")

if __name__ == '__main__':
    unittest.main()
