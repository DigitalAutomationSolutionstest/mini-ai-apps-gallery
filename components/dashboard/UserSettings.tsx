import React from 'react';

interface UserSettingsProps {
  // Definisci qui eventuali props necessarie
}

/**
 * Componente per la gestione delle impostazioni utente
 */
export default function UserSettings({}: UserSettingsProps): React.ReactElement {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Impostazioni Utente</h2>
      
      <div className="space-y-4">
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">Il tuo profilo</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                disabled
                value="utente@esempio.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome utente</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Il tuo nome"
              />
            </div>
          </div>
        </div>

        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-2">Notifiche</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                id="email-notifications"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                Ricevi notifiche via email
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="marketing-emails"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="marketing-emails" className="ml-2 block text-sm text-gray-700">
                Ricevi aggiornamenti sulle nuove funzionalità
              </label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Preferenze di lingua</h3>
          <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option value="it">Italiano</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="button" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Salva modifiche
          </button>
        </div>
      </div>
    </div>
  );
} 