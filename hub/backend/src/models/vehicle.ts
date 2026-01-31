// Vehicle model for ANVL Central Hub
import { DataTypes, Model, Sequelize } from 'sequelize';
import { database } from '../config/database';

// Define the Vehicle model
export class Vehicle extends Model {
  public id!: number;
  public detection_id!: string;
  public timestamp!: Date;
  public toll_booth_id!: number;
  public camera_id!: string;
  public vehicle_type!: string;
  public license_plate_text!: string;
  public license_plate_confidence!: number;
  public make!: string;
  public model!: string;
  public color!: string;
  public make_confidence!: number;
  public model_confidence!: number;
  public color_confidence!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

// Initialize the model
Vehicle.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    detection_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    },
    toll_booth_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    camera_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    vehicle_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    license_plate_text: {
      type: DataTypes.STRING,
      allowNull: true
    },
    license_plate_confidence: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    make: {
      type: DataTypes.STRING,
      allowNull: true
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true
    },
    color: {
      type: DataTypes.STRING,
      allowNull: true
    },
    make_confidence: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    model_confidence: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    color_confidence: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  },
  {
    sequelize: database,
    modelName: 'Vehicle',
    tableName: 'vehicles',
    timestamps: true
  }
);

// Create indexes for better query performance
Vehicle.addHook('afterSync', () => {
  // Indexes for common query patterns
  Vehicle.addIndex({
    fields: ['toll_booth_id', 'timestamp'],
    name: 'vehicles_toll_booth_timestamp_idx'
  });
  
  Vehicle.addIndex({
    fields: ['license_plate_text'],
    name: 'vehicles_plate_text_idx'
  });
  
  Vehicle.addIndex({
    fields: ['make', 'model', 'color'],
    name: 'vehicles_attributes_idx'
  });
  
  Vehicle.addIndex({
    fields: ['timestamp'],
    name: 'vehicles_timestamp_idx'
  });
});