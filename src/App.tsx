import { FormEvent, useEffect, useState } from 'react'
import './App.css'

interface Device {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [newDevice, setNewDevice] = useState<Omit<Device, 'id'>>({
    name: '',
    latitude: 0,
    longitude: 0,
  });

  // Obtener todas las tareas
  // Obtener todos los dispositivos al cargar el componente
  useEffect(() => {
    fetch('http://127.0.0.1:8000/devices')
      .then((response) => response.json())
      .then((data: Device[]) => setDevices(data))
      .catch((error) => console.error('Error fetching devices:', error));
  }, []);

  // Manejar el envío del formulario para agregar un nuevo dispositivo
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    fetch('http://127.0.0.1:8000/devices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newDevice.name,
        latitude: parseFloat(newDevice.latitude.toString()),
        longitude: parseFloat(newDevice.longitude.toString()),
      }),
    })
      .then((response) => response.json())
      .then((data: Device) => {
        setDevices([...devices, data]);
        setNewDevice({ name: '', latitude: 0, longitude: 0 }); // Limpiar el formulario
      })
      .catch((error) => console.error('Error adding device:', error));
  };

  return (
    <div>
      <h1>GPS Device Tracker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Device Name"
          value={newDevice.name}
          onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Latitude"
          value={newDevice.latitude}
          onChange={(e) => setNewDevice({ ...newDevice, latitude: parseFloat(e.target.value) })}
          required
        />
        <input
          type="number"
          placeholder="Longitude"
          value={newDevice.longitude}
          onChange={(e) => setNewDevice({ ...newDevice, longitude: parseFloat(e.target.value) })}
          required
        />
        <button type="submit">Add Device</button>
      </form>

      <h2>Device List</h2>
      <ul>
        {devices.map((device) => (
          <li key={device.id}>
            {device.name} - Lat: {device.latitude}, Lon: {device.longitude}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
