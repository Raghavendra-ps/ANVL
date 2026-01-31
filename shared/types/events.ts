export interface DetectionEvent {
  detection_id: string;             // UUID for the detection event
  timestamp: string;                // ISO 8601 timestamp
  toll_booth_id: number;
  camera_id: string;
  vehicle_type: string | null;
  license_plate_text: string | null;
  license_plate_confidence: number | null;
  make: string | null;
  model: string | null;
  color: string | null;
  make_confidence: number | null;
  model_confidence: number | null;
  color_confidence: number | null;
  image_url: string | null;         // URL to a stored image of the detection (optional)
}
