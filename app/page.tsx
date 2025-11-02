'use client'

import { useState } from 'react'
import { Search, Send, User, MessageCircle, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

interface Master {
  id: string
  name: string
  platform: 'vk' | 'telegram'
  username?: string
  description?: string
  status: 'found' | 'sending' | 'sent' | 'error'
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [messageText, setMessageText] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<('vk' | 'telegram')[]>(['vk', 'telegram'])
  const [masters, setMasters] = useState<Master[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [stats, setStats] = useState({ found: 0, sent: 0, errors: 0 })

  const handleSearch = async () => {
    setIsSearching(true)
    setMasters([])
    setStats({ found: 0, sent: 0, errors: 0 })

    // Симуляция поиска мастеров
    setTimeout(() => {
      const mockMasters: Master[] = []
      const names = [
        'Анна Иванова', 'Мария Петрова', 'Елена Смирнова', 'Ольга Козлова',
        'Наталья Новикова', 'Татьяна Морозова', 'Ирина Волкова', 'Светлана Соколова',
        'Дарья Лебедева', 'Екатерина Егорова', 'Юлия Павлова', 'Алина Васильева'
      ]

      const descriptions = [
        'Маникюр, педикюр, гель-лак',
        'Профессиональный мастер ногтевого сервиса',
        'Аппаратный маникюр, дизайн',
        'Педикюр, spa-уход за ногтями',
        'Маникюр, наращивание, укрепление',
        'Nail-мастер с опытом 5+ лет'
      ]

      const count = Math.floor(Math.random() * 8) + 8

      for (let i = 0; i < count; i++) {
        const platform = selectedPlatforms[Math.floor(Math.random() * selectedPlatforms.length)]
        mockMasters.push({
          id: `${platform}-${i}`,
          name: names[Math.floor(Math.random() * names.length)],
          platform,
          username: platform === 'telegram' ? `@master_${i}` : undefined,
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          status: 'found'
        })
      }

      setMasters(mockMasters)
      setStats(prev => ({ ...prev, found: mockMasters.length }))
      setIsSearching(false)
    }, 2000)
  }

  const handleSendMessages = async () => {
    if (!messageText.trim()) {
      alert('Введите текст сообщения')
      return
    }

    setIsSending(true)
    let sent = 0
    let errors = 0

    for (let i = 0; i < masters.length; i++) {
      setMasters(prev => prev.map((m, idx) =>
        idx === i ? { ...m, status: 'sending' } : m
      ))

      // Симуляция отправки
      await new Promise(resolve => setTimeout(resolve, 500))

      const success = Math.random() > 0.1 // 90% успешных отправок

      setMasters(prev => prev.map((m, idx) =>
        idx === i ? { ...m, status: success ? 'sent' : 'error' } : m
      ))

      if (success) {
        sent++
      } else {
        errors++
      }

      setStats({ found: masters.length, sent, errors })
    }

    setIsSending(false)
  }

  const togglePlatform = (platform: 'vk' | 'telegram') => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎨 Агент поиска мастеров
          </h1>
          <p className="text-gray-600">
            Автоматический поиск мастеров маникюра и педикюра в ВКонтакте и Telegram
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Поисковый запрос
              </label>
              <input
                type="text"
                placeholder="маникюр педикюр мастер"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Платформы
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes('vk')}
                    onChange={() => togglePlatform('vk')}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-gray-700">ВКонтакте</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes('telegram')}
                    onChange={() => togglePlatform('telegram')}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="ml-2 text-gray-700">Telegram</span>
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={isSearching || selectedPlatforms.length === 0}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Поиск мастеров...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Найти мастеров
              </>
            )}
          </button>
        </div>

        {stats.found > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.found}</div>
                <div className="text-sm text-gray-600">Найдено</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{stats.sent}</div>
                <div className="text-sm text-gray-600">Отправлено</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-600">{stats.errors}</div>
                <div className="text-sm text-gray-600">Ошибок</div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Текст сообщения для рассылки
              </label>
              <textarea
                placeholder="Здравствуйте! Интересует ваша услуга..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            <button
              onClick={handleSendMessages}
              disabled={isSending || !messageText.trim()}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Отправка сообщений...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Отправить сообщения всем
                </>
              )}
            </button>
          </div>
        )}

        {masters.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="w-6 h-6" />
              Найденные мастера ({masters.length})
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {masters.map((master) => (
                <div
                  key={master.id}
                  className={`border rounded-lg p-4 transition-all ${
                    master.status === 'sent'
                      ? 'bg-green-50 border-green-300'
                      : master.status === 'error'
                      ? 'bg-red-50 border-red-300'
                      : master.status === 'sending'
                      ? 'bg-yellow-50 border-yellow-300'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{master.name}</h3>
                      {master.username && (
                        <p className="text-sm text-gray-600">{master.username}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        master.platform === 'vk'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-cyan-100 text-cyan-700'
                      }`}>
                        {master.platform === 'vk' ? 'VK' : 'TG'}
                      </span>
                      {master.status === 'sent' && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                      {master.status === 'error' && (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      {master.status === 'sending' && (
                        <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{master.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Демо-режим:</strong> Это демонстрационная версия. В реальной версии требуется:
          </p>
          <ul className="text-sm text-yellow-800 mt-2 ml-4 list-disc">
            <li>API токены ВКонтакте и Telegram</li>
            <li>Соблюдение правил платформ по автоматизации</li>
            <li>Защита от блокировок (лимиты, задержки)</li>
            <li>Серверная часть для безопасного хранения токенов</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
