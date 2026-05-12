const https = require('https');

const MESH_URL =
  'https://localhost';

async function getDevices() {
  return [
    {
      id: 1,
      name: 'ADMIN-PC',
      ip: '192.168.0.10',
      status: 'online',
      os: 'Windows 11',
      group: 'Diona Test'
    },

    {
      id: 2,
      name: 'STUDIO-PC-01',
      ip: '192.168.0.22',
      status: 'offline',
      os: 'Windows 10',
      group: 'Studio'
    }
  ];
}

module.exports = {
  getDevices
};