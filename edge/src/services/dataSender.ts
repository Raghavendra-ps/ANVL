// Path: ANVL-main/edge/src/services/dataSender.ts
import { config } from '../config/config';
import * as https from 'https';
import * as http from 'http';
import { URL } from 'url';
import { DetectionEvent } from '@anvl/shared/types/events';

// Send detection event to central hub
export async function sendToCentralHub(detectionEvent: DetectionEvent): Promise<void> {
  const hubUrl = config.central_hub.url;
  const apiKey = config.central_hub.api_key;
  
  return new Promise((resolve, reject) => {
    try {
      const url = new URL('/api/detections', hubUrl);
      const data = JSON.stringify(detectionEvent);
      
      const options: any = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          'Authorization': `Bearer ${apiKey}`
        }
      };
      
      // Use HTTP or HTTPS based on URL
      const client = url.protocol === 'https:' ? https : http;
      
      const req = client.request(options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`Successfully sent detection to central hub: ${detectionEvent.detection_id}`);
            resolve();
          } else {
            console.error(`Failed to send detection: ${res.statusCode} - ${responseData}`);
            reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
          }
        });
      });
      
      req.on('error', (error) => {
        console.error(`Error sending to central hub: ${error}`);
        reject(error);
      });
      
      req.write(data);
      req.end();
    } catch (error) {
      console.error(`Error in sendToCentralHub: ${error}`);
      reject(error);
    }
  });
}

// Buffer data for offline mode
export async function bufferData(detectionEvent: DetectionEvent): Promise<void> {
  // In production, this would store data locally in a buffer
  // For now, we'll just log it
  console.log(`Buffering detection event for offline storage: ${detectionEvent.detection_id}`);
  
  // This would actually write to local storage in production
  // const bufferPath = path.join('/tmp/anvil_buffer', `${detectionEvent.detection_id}.json`);
  // fs.writeFileSync(bufferPath, JSON.stringify(detectionEvent));
}