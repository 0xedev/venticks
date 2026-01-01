export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-6xl font-bold text-center mb-8">
          🎫 Venticks
        </h1>
        <p className="text-2xl text-center mb-12 text-gray-600">
          Nigerian Event Ticketing Platform
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <div className="p-6 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
            <h3 className="text-xl font-semibold mb-2">🎉 Event Management</h3>
            <p className="text-gray-600">Create and manage events with approval workflow</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
            <h3 className="text-xl font-semibold mb-2">🎟️ Ticketing System</h3>
            <p className="text-gray-600">Multiple ticket types with QR code validation</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
            <h3 className="text-xl font-semibold mb-2">💳 Payment Integration</h3>
            <p className="text-gray-600">Paystack & OPay for Nigerian payments</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
            <h3 className="text-xl font-semibold mb-2">🌍 Multi-language</h3>
            <p className="text-gray-600">English, Pidgin, Yoruba, Hausa, Igbo</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
            <h3 className="text-xl font-semibold mb-2">⏰ WAT Timezone</h3>
            <p className="text-gray-600">West Africa Time support</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
            <h3 className="text-xl font-semibold mb-2">🚀 Scalable</h3>
            <p className="text-gray-600">Built for 10M+ users with Redis & BullMQ</p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Platform is being built. Coming soon!
          </p>
        </div>
      </div>
    </main>
  )
}
