import React, { useState, useRef, useEffect } from 'react';
import { Camera, QrCode, Clock, User, MapPin, Check, X, Search, Plus, Edit, RotateCcw } from 'lucide-react';

const StaffCheckinApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock data
  const [bookings] = useState([
    {
      id: 'BK001',
      customerName: 'María García',
      customerPhone: '+34 612 345 678',
      startTime: '10:00',
      endTime: '12:00',
      duration: '2h',
      type: 'Moto de Agua',
      status: 'pending',
      unitAssigned: null,
      checkInTime: null,
      checkOutTime: null,
      totalHours: 0
    },
    {
      id: 'BK002',
      customerName: 'Carlos Fernández',
      customerPhone: '+34 687 654 321',
      startTime: '11:30',
      endTime: '13:30',
      duration: '2h',
      type: 'Barco (Sin Licencia)',
      status: 'pending',
      unitAssigned: null,
      checkInTime: null,
      checkOutTime: null,
      totalHours: 0
    },
    {
      id: 'BK003',
      customerName: 'Ana Rodríguez',
      customerPhone: '+34 654 987 123',
      startTime: '09:00',
      endTime: '11:00',
      duration: '2h',
      type: 'Moto de Agua',
      status: 'checked-in',
      unitAssigned: 'JS-003',
      checkInTime: '09:05',
      checkOutTime: null,
      totalHours: 1.2
    }
  ]);

  const [fleet] = useState([
    { id: 'JS-001', type: 'Moto de Agua', model: 'Yamaha VX', status: 'available', totalHours: 245.5, qrCode: 'QR-JS001' },
    { id: 'JS-002', type: 'Moto de Agua', model: 'Sea-Doo GTI', status: 'available', totalHours: 189.2, qrCode: 'QR-JS002' },
    { id: 'JS-003', type: 'Moto de Agua', model: 'Yamaha VX', status: 'in-use', totalHours: 156.8, qrCode: 'QR-JS003' },
    { id: 'BT-001', type: 'Barco (Sin Licencia)', model: 'Quicksilver 455', status: 'available', totalHours: 324.1, qrCode: 'QR-BT001' },
    { id: 'BT-002', type: 'Barco (Sin Licencia)', model: 'Beneteau Flyer 5.5', status: 'maintenance', totalHours: 412.7, qrCode: 'QR-BT002' }
  ]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate QR scanner
  const simulateQRScan = (qrCode) => {
    setScannedCode(qrCode);
    setScannerActive(false);
    
    // Find the unit that matches this QR code
    const unit = fleet.find(u => u.qrCode === qrCode);
    if (unit && selectedBooking) {
      handleUnitAssignment(unit);
    }
  };

  const handleUnitAssignment = (unit) => {
    if (selectedBooking && unit.status === 'available') {
      // Update booking with assigned unit
      const updatedBooking = {
        ...selectedBooking,
        unitAssigned: unit.id,
        status: 'checked-in',
        checkInTime: currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
      setSelectedBooking(updatedBooking);
      alert(`✅ Unidad ${unit.id} asignada a ${selectedBooking.customerName}`);
    }
  };

  const handleCheckOut = () => {
    if (selectedBooking) {
      const updatedBooking = {
        ...selectedBooking,
        status: 'completed',
        checkOutTime: currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        totalHours: selectedBooking.totalHours + 0.5 // Simulate adding hours
      };
      setSelectedBooking(updatedBooking);
      alert(`✅ ${selectedBooking.customerName} ha completado el check-out`);
    }
  };

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Reservas de Hoy</h2>
        <div className="space-y-3">
          {bookings.map(booking => (
            <div key={booking.id} 
                 className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                   booking.status === 'pending' ? 'border-yellow-200 bg-yellow-50' :
                   booking.status === 'checked-in' ? 'border-blue-200 bg-blue-50' :
                   'border-green-200 bg-green-50'
                 }`}
                 onClick={() => {
                   setSelectedBooking(booking);
                   setCurrentView('booking-detail');
                 }}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">{booking.customerName}</div>
                  <div className="text-sm text-gray-600">{booking.startTime} - {booking.endTime} • {booking.type}</div>
                  {booking.unitAssigned && (
                    <div className="text-sm text-blue-600 font-medium">Unidad: {booking.unitAssigned}</div>
                  )}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  booking.status === 'checked-in' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {booking.status === 'pending' ? 'Pendiente Check-in' :
                   booking.status === 'checked-in' ? 'En Progreso' : 'Completado'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Estado de la Flota</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fleet.map(unit => (
            <div key={unit.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-gray-900">{unit.id}</div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  unit.status === 'available' ? 'bg-green-100 text-green-800' :
                  unit.status === 'in-use' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {unit.status === 'available' ? 'Disponible' :
                   unit.status === 'in-use' ? 'En Uso' : 'Mantenimiento'}
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-1">{unit.model}</div>
              <div className="text-sm text-gray-500">
                <Clock className="inline w-4 h-4 mr-1" />
                {unit.totalHours}h total
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const BookingDetailView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Volver al Panel
          </button>
          <div className="text-sm text-gray-500">
            Reserva ID: {selectedBooking?.id}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Información del Cliente</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="font-medium">{selectedBooking?.customerName}</div>
                  <div className="text-sm text-gray-600">{selectedBooking?.customerPhone}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="font-medium">{selectedBooking?.startTime} - {selectedBooking?.endTime}</div>
                  <div className="text-sm text-gray-600">{selectedBooking?.duration} duración</div>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <div className="font-medium">{selectedBooking?.type}</div>
                  {selectedBooking?.unitAssigned && (
                    <div className="text-sm text-blue-600">Asignado: {selectedBooking.unitAssigned}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Estado del Alquiler</h2>
            <div className="space-y-3">
              {selectedBooking?.checkInTime && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-medium">{selectedBooking.checkInTime}</span>
                </div>
              )}
              {selectedBooking?.checkOutTime && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-medium">{selectedBooking.checkOutTime}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Horas Utilizadas:</span>
                <span className="font-medium">{selectedBooking?.totalHours || 0}h</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          {selectedBooking?.status === 'pending' && (
            <button
              onClick={() => setScannerActive(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Escanear Código QR de Unidad
            </button>
          )}
          
          {selectedBooking?.status === 'checked-in' && (
            <button
              onClick={handleCheckOut}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Check className="w-5 h-5 mr-2" />
              Completar Check-out
            </button>
          )}
        </div>
      </div>

      {/* QR Scanner Modal */}
      {scannerActive && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Escanear Código QR de Unidad</h3>
              <button 
                onClick={() => setScannerActive(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Simulated Camera View */}
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-4">
              <div className="text-center">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Apunta la cámara al código QR</p>
              </div>
            </div>

            {/* Demo QR Codes for Testing */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-2">Demo: Haz clic para simular el escaneo:</p>
              <div className="grid grid-cols-2 gap-2">
                {fleet.filter(unit => unit.status === 'available').map(unit => (
                  <button
                    key={unit.id}
                    onClick={() => simulateQRScan(unit.qrCode)}
                    className="p-2 border rounded text-sm hover:bg-gray-50"
                  >
                    {unit.id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Alfa Naútica</h1>
            <p className="text-blue-100">Sistema de Check-in Personal</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">
              {currentTime.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="font-mono text-lg">
              {currentTime.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="px-4 py-2">
          <div className="flex space-x-6">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'dashboard' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Panel Principal
            </button>
            <button
              onClick={() => setCurrentView('fleet')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'fleet' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Gestión de Flota
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'booking-detail' && <BookingDetailView />}
      </div>
    </div>
  );
};

export default StaffCheckinApp;