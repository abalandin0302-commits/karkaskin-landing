/* =========================================================
   Конфигурация сайта — заполните под своё окружение
   ========================================================= */
export const CONFIG = {
  /* Токен Telegram-бота и chat_id получателя заявок.
     Как получить: @BotFather → /newbot → токен; узнать chat_id:
     написать боту и открыть https://api.telegram.org/bot<ТОКЕН>/getUpdates */
  telegramToken: '',
  telegramChatId: '',

  /* Если токен нельзя держать в браузере — укажите свой прокси-эндпоинт.
     Он должен принять POST JSON {text, payload} и вернуть 2xx. */
  proxyEndpoint: '',

  /* Альтернатива: внешний сервис приёма форм (Formspree, Getform, …) */
  formEndpoint: '',

  /* Контакты */
  phone: '+7 921 915-37-06',
  phoneHref: '+79219153706',
  phone2: '8 (812) 915-37-06',
  email: 'mail@karkaskin.ru',
  telegram: 'http://t.me/Karkaskin_spb',
  max: 'https://max.ru/u/f9LHodD0cOK1lO4Oa-GV6ywvk-eWFjMYLdY9VHFgPA9asbi6qqAewZuiCBw',
  address: '197375, РФ, Санкт-Петербург, ул. Заповедная д. 62',
  hours: 'Пн–Пт 9:00–18:00',
  yandexMapId: '1264554017',
};
