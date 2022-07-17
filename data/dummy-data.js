import Module from '../models/module';

export const MODULES = [
  new Module('m1', 'Dimensionamiento', '#f5428d', require('../assets/modules/box.png'), 'Dimensionamiento'),
  new Module('m2', 'Transporte', '#1ebbd7', require('../assets/modules/box.png'), 'Transporte'),
  new Module('m3', 'Planificación', '#f54242', require('../assets/modules/process.png'), 'Planificación'),
  new Module('m4', 'Carga', '#f5a442', require('../assets/modules/delivery-truck.png'), 'Carga'),
  new Module('m5', 'Seguimiento', '#f5d142', require('../assets/modules/fast-delivery.png'), 'Seguimiento'),
];