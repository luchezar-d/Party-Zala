// Bulgarian localization
export const BG = {
  // Dates and time
  months: [
    'януари', 'февруари', 'март', 'април', 'май', 'юни',
    'юли', 'август', 'септември', 'октомври', 'ноември', 'декември'
  ],
  monthsShort: [
    'яну', 'фев', 'мар', 'апр', 'май', 'юни',
    'юли', 'авг', 'сеп', 'окт', 'ное', 'дек'
  ],
  weekdays: ['неделя', 'понделник', 'вторник', 'сряда', 'четвъртък', 'петък', 'събота'],
  weekdaysShort: ['НЕД', 'ПОН', 'ВТО', 'СРЯ', 'ЧЕТ', 'ПЕТ', 'СЪБ'],
  
  // Common UI
  today: 'Днес',
  loading: 'Зареждане...',
  cancel: 'Отказ',
  save: 'Запиши',
  delete: 'Изтрий',
  edit: 'Редактирай',
  create: 'Създай',
  update: 'Обнови',
  close: 'Затвори',
  
  // Party-related
  party: 'парти',
  parties: 'партита',
  scheduledParties: 'Планирани партита',
  addNewParty: 'Добави ново парти',
  createParty: 'Създай парти',
  updateParty: 'Обнови парти',
  partyDetails: 'Детайли за партито',
  
  // Form labels
  kidName: 'Име на детето',
  kidAge: 'Възраст',
  locationName: 'Местоположение',
  startTime: 'Начален час',
  endTime: 'Краен час',  
  address: 'Адрес',
  parentName: 'Име на родител',
  parentEmail: 'Имейл на родител',
  expectedGuests: 'Очаквани гости',
  notes: 'Бележки',
  
  // Units and suffixes
  yearsOld: 'години',
  guests: 'гости',
  guest: 'гост',
  more: 'още',
  
  // Messages
  noPartiesScheduled: 'Няма планирани партита за този ден',
  noPartiesThisWeek: 'Няма партита тази седмица!',
  noPartiesYet: 'Още няма партита!',
  tapToAddParty: 'Натисни за да добавиш парти 🎉',
  clickToSchedule: 'Натисни на някой ден за да планираш първото си детско парти.',
  partyCreatedSuccess: 'Партито е създадено успешно! 🎉',
  partyUpdatedSuccess: 'Партито е обновено успешно! 🎉',
  partyDeletedSuccess: 'Партито е изтрито успешно',
  
  // Auth
  welcome: 'Добре дошъл',
  logout: 'Изход',
  accessDenied: 'Достъпът е отказан',
  pleaseLogin: 'Моля влезте в профила си за достъп до календара.',
  goToLogin: 'Към входа',
  
  // App title
  appTitle: 'Party Zala',
  appSubtitle: 'Календар за детски партита',
  
  // Age brackets
  ages1to4: 'Възраст 1–4',
  ages5to8: 'Възраст 5–8', 
  ages9to12: 'Възраст 9–12',
  teens: 'Тийнейджъри',
  
  // Validation messages
  kidNameRequired: 'Името на детето е задължително',
  kidNameMinLength: 'Името на детето трябва да е поне 2 символа',
  ageRequired: 'Възрастта е задължителна',
  ageMinMax: 'Възрастта трябва да е между 1 и 18 години',
  locationRequired: 'Местоположението е задължително',
  validEmail: 'Моля въведете валиден имейл',
  guestCountNegative: 'Броят гости не може да е отрицателен',
  
  // Time formatting
  formatTime: (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  },
  
  // Date formatting helpers
  formatDate: (date: Date) => {
    const day = date.getDate();
    const month = BG.months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  },
  
  formatDateShort: (date: Date) => {
    const day = date.getDate();
    const month = BG.monthsShort[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  },
  
  formatWeekday: (date: Date) => {
    return BG.weekdays[date.getDay()];
  },
  
  formatWeekdayShort: (date: Date) => {
    return BG.weekdaysShort[date.getDay()];
  }
};
