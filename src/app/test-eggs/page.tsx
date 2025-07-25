'use client';

export default function TestEggs() {
  return (
    <div className="min-h-screen bg-[#FFCF08] p-8">
      <h1 className="text-3xl font-bold mb-8">Egg Image Test</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Raw Egg</h2>
          <img 
            src="/raw-egg.png" 
            alt="Raw egg" 
            className="w-32 h-32 border-2 border-black"
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Fried Egg</h2>
          <img 
            src="/fried-egg.png" 
            alt="Fried egg" 
            className="w-32 h-32 border-2 border-black"
          />
        </div>
      </div>
    </div>
  );
}
