export type FigureId = "cube" | "cuboid" | "sphere" | "cylinder" | "cone" | "pyramid" | "prism";

export type Parameters = Record<string, number>;

type Control = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  hint: string;
};

type Figure = {
  id: FigureId;
  name: string;
  definition: string;
  controls: Control[];
  volumeFormula: string;
  surfaceFormula: string;
  realObject: string;
  lifeExplanation: string;
  task: string;
  effectExplanation: string;
};

export const FIGURES: Figure[] = [
  {
    id: "cube",
    name: "Куб",
    definition: "Усі ребра однакові, а грані є квадратами.",
    controls: [{ key: "edge", label: "Довжина ребра", min: 1, max: 8, step: 0.5, hint: "Ребро - це відрізок, де сходяться дві грані куба." }],
    volumeFormula: "V=a^3",
    surfaceFormula: "S=6a^2",
    realObject: "кубик Рубіка",
    lifeExplanation: "Кубічну форму мають ігрові кубики, коробки, блоки конструктора.",
    task: "Збільш ребро куба у 2 рази та порівняй, у скільки разів зміниться об'єм.",
    effectExplanation: "Об'єм куба залежить від третього степеня ребра, тому подвоєння ребра збільшує об'єм у 8 разів.",
  },
  {
    id: "cuboid",
    name: "Паралелепіпед",
    definition: "Фігура з прямокутними гранями, яка має довжину, ширину та висоту.",
    controls: [
      { key: "length", label: "Довжина", min: 1, max: 9, step: 0.5, hint: "Довжина - найдовший горизонтальний вимір основи." },
      { key: "width", label: "Ширина", min: 1, max: 7, step: 0.5, hint: "Ширина показує другий горизонтальний вимір основи." },
      { key: "height", label: "Висота", min: 1, max: 8, step: 0.5, hint: "Висота - відстань від основи до верхньої грані." },
    ],
    volumeFormula: "V=abc",
    surfaceFormula: "S=2(ab+bc+ac)",
    realObject: "цеглина",
    lifeExplanation: "Паралелепіпед легко побачити у цеглинах, коробках, шафах та будівельних блоках.",
    task: "Залиш ширину сталою, а довжину й висоту змінюй окремо. Який параметр швидше збільшує об'єм?",
    effectExplanation: "Кожен лінійний параметр множить об'єм прямо пропорційно: збільшили один вимір удвічі - об'єм теж удвічі.",
  },
  {
    id: "sphere",
    name: "Куля",
    definition: "Усі точки поверхні кулі однаково віддалені від центра.",
    controls: [{ key: "radius", label: "Радіус", min: 1, max: 6, step: 0.5, hint: "Радіус - відстань від центра кулі до будь-якої точки її поверхні." }],
    volumeFormula: "V=\\frac{4}{3}\\pi r^3",
    surfaceFormula: "S=4\\pi r^2",
    realObject: "планета",
    lifeExplanation: "Куля зустрічається у футбольних м'ячах, апельсинах, глобусах і планетах.",
    task: "Збільш радіус кулі у 2 рази та подивись, як зміниться об'єм.",
    effectExplanation: "Об'єм кулі залежить від r^3, тому радіус дуже сильно впливає на результат.",
  },
  {
    id: "cylinder",
    name: "Циліндр",
    definition: "Має дві рівні круглі основи та бічну поверхню.",
    controls: [
      { key: "radius", label: "Радіус", min: 1, max: 5, step: 0.5, hint: "Радіус основи - відстань від центра круга до його краю." },
      { key: "height", label: "Висота", min: 1, max: 9, step: 0.5, hint: "Висота - відстань між двома круглими основами." },
    ],
    volumeFormula: "V=\\pi r^2h",
    surfaceFormula: "S=2\\pi r(r+h)",
    realObject: "банка бобів",
    lifeExplanation: "Циліндричними є банки напоїв, склянки, батарейки, труби та багато контейнерів.",
    task: "Збільш радіус циліндра у 2 рази та подивись, як зміниться об'єм.",
    effectExplanation: "Радіус у формулі підноситься до квадрата, тому подвоєння радіуса збільшує об'єм у 4 рази.",
  },
  {
    id: "cone",
    name: "Конус",
    definition: "Має круглу основу та вершину, з'єднану з усіма точками кола.",
    controls: [
      { key: "radius", label: "Радіус", min: 1, max: 5, step: 0.5, hint: "Радіус визначає розмір круглої основи конуса." },
      { key: "height", label: "Висота", min: 1, max: 9, step: 0.5, hint: "Висота - перпендикуляр від вершини до центра основи." },
    ],
    volumeFormula: "V=\\frac{1}{3}\\pi r^2h",
    surfaceFormula: "S=\\pi r(r+l),\\; l=\\sqrt{r^2+h^2}",
    realObject: "дорожній конус",
    lifeExplanation: "Конус можна побачити у дорожніх конусах, ріжках морозива та святкових ковпаках.",
    task: "Порівняй конус і циліндр з однаковим радіусом та висотою.",
    effectExplanation: "Об'єм конуса дорівнює третині об'єму циліндра з такою самою основою та висотою.",
  },
  {
    id: "pyramid",
    name: "Піраміда",
    definition: "Має основу-квадрат і трикутні бічні грані, що сходяться у вершині.",
    controls: [
      { key: "base", label: "Сторона основи", min: 1, max: 8, step: 0.5, hint: "Основа - нижня грань, на якій стоїть піраміда." },
      { key: "height", label: "Висота", min: 1, max: 9, step: 0.5, hint: "Висота - перпендикуляр від вершини до центра основи." },
    ],
    volumeFormula: "V=\\frac{1}{3}a^2h",
    surfaceFormula: "S=a^2+2a\\sqrt{(a/2)^2+h^2}",
    realObject: "єгипетська піраміда",
    lifeExplanation: "Пірамідальна форма відома за єгипетськими пірамідами, дахами та декоративними конструкціями.",
    task: "Збільш висоту піраміди, не змінюючи основу. Що відбувається з об'ємом?",
    effectExplanation: "Коли площа основи стала, об'єм піраміди змінюється прямо пропорційно висоті.",
  },
  {
    id: "prism",
    name: "Призма",
    definition: "Має дві рівні паралельні основи та бічні грані.",
    controls: [
      { key: "base", label: "Сторона трикутної основи", min: 1, max: 7, step: 0.5, hint: "Основа призми тут є рівностороннім трикутником." },
      { key: "height", label: "Висота призми", min: 1, max: 9, step: 0.5, hint: "Висота призми - відстань між двома однаковими основами." },
    ],
    volumeFormula: "V=S_{осн}\\cdot h,\\; S_{осн}=\\frac{\\sqrt3}{4}a^2",
    surfaceFormula: "S=2S_{осн}+3ah",
    realObject: "шоколадка Toblerone",
    lifeExplanation: "Трикутну призму легко впізнати у формі шоколадки Toblerone, деяких дахів і туристичних наметів.",
    task: "Збільш сторону основи та порівняй зміну площі основи й об'єму.",
    effectExplanation: "Площа трикутної основи залежить від a^2, тому зміна сторони основи впливає сильніше, ніж така сама зміна висоти.",
  },
];

export function defaultParams(id: FigureId): Parameters {
  switch (id) {
    case "cube":
      return { edge: 4 };
    case "cuboid":
      return { length: 5, width: 3, height: 4 };
    case "sphere":
      return { radius: 3 };
    case "cylinder":
      return { radius: 2.5, height: 5 };
    case "cone":
      return { radius: 2.5, height: 5 };
    case "pyramid":
      return { base: 4, height: 5 };
    case "prism":
      return { base: 4, height: 6 };
  }
}

export function calculateFigure(id: FigureId, params: Parameters) {
  switch (id) {
    case "cube": {
      const a = params.edge;
      return { volume: a ** 3, surfaceArea: 6 * a ** 2 };
    }
    case "cuboid": {
      const { length: a, width: b, height: c } = params;
      return { volume: a * b * c, surfaceArea: 2 * (a * b + b * c + a * c) };
    }
    case "sphere": {
      const r = params.radius;
      return { volume: (4 / 3) * Math.PI * r ** 3, surfaceArea: 4 * Math.PI * r ** 2 };
    }
    case "cylinder": {
      const { radius: r, height: h } = params;
      return { volume: Math.PI * r ** 2 * h, surfaceArea: 2 * Math.PI * r * (r + h) };
    }
    case "cone": {
      const { radius: r, height: h } = params;
      const l = Math.sqrt(r ** 2 + h ** 2);
      return { volume: (Math.PI * r ** 2 * h) / 3, surfaceArea: Math.PI * r * (r + l) };
    }
    case "pyramid": {
      const { base: a, height: h } = params;
      const slant = Math.sqrt((a / 2) ** 2 + h ** 2);
      return { volume: (a ** 2 * h) / 3, surfaceArea: a ** 2 + 2 * a * slant };
    }
    case "prism": {
      const { base: a, height: h } = params;
      const baseArea = (Math.sqrt(3) / 4) * a ** 2;
      return { volume: baseArea * h, surfaceArea: 2 * baseArea + 3 * a * h };
    }
  }
}
