// Path: ANVL-main/edge/src/services/inferenceClient.ts
import * as http from 'http';
import { URL } from 'url';
import { config } from '../config/config';
import { Buffer } from 'buffer';
import {
  VehicleDetection,
  VehicleDetectionResponse,
  LicensePlate,
  LicensePlateResponse,
  VehicleAttributes,
  VehicleAttributesResponse
} from '@anvl/shared/types/inference';

// A generic helper to make POST requests to the inference service
async function postToInferenceApi<T>(path: string, data: Buffer): Promise<T> {
  const inferenceUrl = new URL(path, config.inference_pipeline.url);

  return new Promise((resolve, reject) => {
    const options: http.RequestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream', // Sending raw image data
        'Content-Length': data.length,
      },
    };

    const req = http.request(inferenceUrl, options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(responseBody));
          } catch (e) {
            reject(new Error('Failed to parse inference API response'));
          }
        } else {
          reject(new Error(`Inference API returned status ${res.statusCode}: ${responseBody}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`Failed to call inference API: ${e.message}`));
    });

    req.write(data);
    req.end();
  });
}

// Calls the /api/detect/vehicles endpoint
export async function detectVehicles(frameData: Buffer): Promise<VehicleDetection[]> {
  console.log('Calling Inference Pipeline for vehicle detection');
  const response = await postToInferenceApi<VehicleDetectionResponse>('/api/detect/vehicles', frameData);
  return response.detections;
}

// Calls the /api/detect/license-plates endpoint
export async function extractLicensePlates(vehicleImage: Buffer): Promise<LicensePlate | null> {
  console.log('Calling Inference Pipeline for license plate extraction');
  const response = await postToInferenceApi<LicensePlateResponse>('/api/detect/license-plates', vehicleImage);
  return response.plate;
}

// Calls the /api/infer/attributes endpoint
export async function inferVehicleAttributes(vehicleImage: Buffer): Promise<VehicleAttributes> {
  console.log('Calling Inference Pipeline for vehicle attributes');
  const response = await postToInferenceApi<VehicleAttributesResponse>('/api/infer/attributes', vehicleImage);
  return response.attributes;
}