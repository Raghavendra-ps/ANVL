// Path: ANVL-main/shared/types/inference.ts

/**
 * The response structure for the vehicle detection endpoint in the Inference Pipeline.
 */
export interface VehicleDetection {
  vehicle_type: string;
  bbox: [number, number, number, number]; // [x, y, width, height]
  confidence: number;
  camera_id?: string; // This is added at the edge, but good to have in the type
}

export interface VehicleDetectionResponse {
  detections: VehicleDetection[];
  timestamp: string;
}

/**
 * The response structure for the license plate extraction endpoint.
 */
export interface LicensePlate {
  text: string;
  confidence: number;
  bbox: [number, number, number, number];
}

export interface LicensePlateResponse {
  plate: LicensePlate | null;
  timestamp: string;
}

/**
 * The response structure for the vehicle attributes inference endpoint.
 */
export interface VehicleAttributes {
  make: string;
  model: string;
  color: string;
  make_confidence: number;
  model_confidence: number;
  color_confidence: number;
}

export interface VehicleAttributesResponse {
  attributes: VehicleAttributes;
  timestamp: string;
}
