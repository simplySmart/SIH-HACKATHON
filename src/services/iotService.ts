import { mockSensors, mockGateways } from '../data/sensors';
import { IotSensor, IotGateway } from '../types';

export const IotService = {
  getSensors: async (): Promise<IotSensor[]> => {
    return Promise.resolve([...mockSensors]);
  },
  getGateways: async (): Promise<IotGateway[]> => {
    return Promise.resolve([...mockGateways]);
  }
};
