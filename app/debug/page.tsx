import APIHealthCheck from '@/components/APIHealthCheck'

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Debug Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-8">
          <APIHealthCheck />
        </div>
      </div>
    </div>
  )
} 