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
  allFormulas: { label: string; latex: string }[];
  elements: { key: string; name: string; desc?: string }[];
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
    allFormulas: [
      { label: "Об'єм", latex: "V = a^3" },
      { label: "Площа поверхні", latex: "S = 6a^2" },
      { label: "Площа грані", latex: "S_{\\text{грані}} = a^2" },
      { label: "Діагональ грані", latex: "d = a\\sqrt{2}" },
      { label: "Діагональ куба", latex: "D = a\\sqrt{3}" },
      { label: "Периметр ребер", latex: "P = 12a" },
      { label: "Радіус вписаної кулі", latex: "r = \\frac{a}{2}" },
      { label: "Радіус описаної кулі", latex: "R = \\frac{a\\sqrt{3}}{2}" },
      { label: "Ребро через об'єм", latex: "a = \\sqrt[3]{V}" },
      { label: "Ребро через площу поверхні", latex: "a = \\sqrt{\\frac{S}{6}}" },
      { label: "Переріз через діагоналі граней", latex: "S_{\\text{пер}} = a^2" },
      { label: "Переріз через діагональ куба", latex: "S_{\\text{пер}} = a^2\\sqrt{2}" },
    ],
    elements: [
      { key: "a", name: "Ребро", desc: "Відрізок, що сполучає дві сусідні вершини. У куба всі 12 ребер рівні." },
      { key: "D", name: "Діагональ куба", desc: "Відрізок між двома протилежними вершинами куба, що проходить через центр. D = a√3." },
      { key: "d", name: "Діагональ грані", desc: "Відрізок між протилежними вершинами однієї грані. d = a√2." },
      { key: "face-top", name: "Верхня грань", desc: "Квадратна грань зверху куба." },
      { key: "face-bottom", name: "Нижня грань", desc: "Квадратна грань знизу куба, на яку він спирається." },
      { key: "face-front", name: "Передня грань", desc: "Одна з чотирьох вертикальних граней, повернута до спостерігача." },
      { key: "face-side", name: "Бічна грань", desc: "Одна з чотирьох вертикальних граней куба." },
    ],
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
    allFormulas: [
      { label: "Об'єм", latex: "V = abc" },
      { label: "Площа поверхні", latex: "S = 2(ab + bc + ac)" },
      { label: "Діагональ паралелепіпеда", latex: "D = \\sqrt{a^2 + b^2 + c^2}" },
      { label: "Діагональ грані ab", latex: "d_{ab} = \\sqrt{a^2 + b^2}" },
      { label: "Діагональ грані bc", latex: "d_{bc} = \\sqrt{b^2 + c^2}" },
      { label: "Діагональ грані ac", latex: "d_{ac} = \\sqrt{a^2 + c^2}" },
      { label: "Периметр ребер", latex: "P = 4(a + b + c)" },
      { label: "Площа грані ab", latex: "S_{ab} = ab" },
      { label: "Площа грані bc", latex: "S_{bc} = bc" },
      { label: "Площа грані ac", latex: "S_{ac} = ac" },
      { label: "Переріз через діагоналі грані ab", latex: "S_{\\text{пер}} = c\\sqrt{a^2+b^2}" },
      { label: "Переріз через діагоналі грані ac", latex: "S_{\\text{пер}} = b\\sqrt{a^2+c^2}" },
    ],
    elements: [
      { key: "edge", name: "Ребро", desc: "Відрізки, що є сторонами граней. Ребра, що сходяться у вершині, називаються вимірами (довжина, ширина, висота)." },
      { key: "D", name: "Діагональ паралелепіпеда", desc: "Відрізок між протилежними вершинами, що проходить через центр. D = √(a²+b²+c²)." },
      { key: "d", name: "Діагональ грані", desc: "Відрізок між протилежними вершинами однієї грані. Кожна грань має дві діагоналі." },
      { key: "face-side", name: "Грань", desc: "Прямокутна плоска поверхня паралелепіпеда. Усього їх 6." },
    ],
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
    allFormulas: [
      { label: "Об'єм", latex: "V = \\frac{4}{3}\\pi r^3" },
      { label: "Площа поверхні", latex: "S = 4\\pi r^2" },
      { label: "Діаметр", latex: "D = 2r" },
      { label: "Довжина великого кола", latex: "C = 2\\pi r" },
      { label: "Радіус через об'єм", latex: "r = \\sqrt[3]{\\frac{3V}{4\\pi}}" },
      { label: "Радіус через площу", latex: "r = \\sqrt{\\frac{S}{4\\pi}}" },
      { label: "Площа перерізу через центр", latex: "S_{\\text{пер}} = \\pi r^2" },
      { label: "Об'єм через діаметр", latex: "V = \\frac{\\pi D^3}{6}" },
      { label: "Переріз на відстані d від центра", latex: "S_{\\text{пер}} = \\pi(r^2 - d^2)" },
    ],
    elements: [
      { key: "r", name: "Радіус", desc: "Відстань від центра кулі до будь-якої точки поверхні." },
      { key: "D", name: "Діаметр", desc: "Найбільша хорда кулі, що проходить через центр. D = 2r." },
      { key: "face-surface", name: "Поверхня", desc: "Замкнута крива поверхня, всі точки якої рівновіддалені від центра." },
    ],
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
    allFormulas: [
      { label: "Об'єм", latex: "V = \\pi r^2 h" },
      { label: "Площа повної поверхні", latex: "S = 2\\pi r(r + h)" },
      { label: "Площа бічної поверхні", latex: "S_{\\text{біч}} = 2\\pi r h" },
      { label: "Площа основи", latex: "S_{\\text{осн}} = \\pi r^2" },
      { label: "Твірна (прямий циліндр)", latex: "l = h" },
      { label: "Висота через об'єм", latex: "h = \\frac{V}{\\pi r^2}" },
      { label: "Радіус через об'єм", latex: "r = \\sqrt{\\frac{V}{\\pi h}}" },
      { label: "Діагональ осьового перерізу", latex: "d = \\sqrt{4r^2 + h^2}" },
      { label: "Площа осьового перерізу", latex: "S_{\\text{ось}} = 2rh" },
      { label: "Переріз паралельно основі на висоті y", latex: "S_{\\text{пер}} = \\pi r^2" },
    ],
    elements: [
      { key: "r", name: "Радіус", desc: "Відстань від центра круглої основи до її краю." },
      { key: "h", name: "Висота", desc: "Відстань між двома паралельними основами циліндра." },
      { key: "l", name: "Твірна", desc: "Відрізок на бічній поверхні, що з'єднує відповідні точки двох основ. У прямого циліндра твірна дорівнює висоті." },
      { key: "face-base", name: "Основа", desc: "Два паралельні рівні круги, що лежать у різних площинах." },
      { key: "face-side", name: "Бічна поверхня", desc: "Крива поверхня, що з'єднує дві основи. Розгортка — прямокутник." },
    ],
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
    allFormulas: [
      { label: "Об'єм", latex: "V = \\frac{1}{3}\\pi r^2 h" },
      { label: "Площа повної поверхні", latex: "S = \\pi r(r + l)" },
      { label: "Площа бічної поверхні", latex: "S_{\\text{біч}} = \\pi r l" },
      { label: "Твірна", latex: "l = \\sqrt{r^2 + h^2}" },
      { label: "Площа основи", latex: "S_{\\text{осн}} = \\pi r^2" },
      { label: "Висота через об'єм", latex: "h = \\frac{3V}{\\pi r^2}" },
      { label: "Радіус через об'єм", latex: "r = \\sqrt{\\frac{3V}{\\pi h}}" },
      { label: "Висота через твірну", latex: "h = \\sqrt{l^2 - r^2}" },
      { label: "Кут при вершині осьового перерізу", latex: "\\alpha = 2\\arctan\\frac{r}{h}" },
      { label: "Площа осьового перерізу", latex: "S_{\\text{ось}} = rh" },
      { label: "Переріз паралельно основі на висоті y", latex: "S_{\\text{пер}} = \\pi r^2 \\left(1 - \\frac{y}{h}\\right)^2" },
    ],
    elements: [
      { key: "r", name: "Радіус", desc: "Відстань від центра основи до її краю." },
      { key: "h", name: "Висота", desc: "Перпендикуляр від вершини до центра основи." },
      { key: "l", name: "Твірна", desc: "Відрізок від вершини до точки на колі основи. l = √(r²+h²)." },
      { key: "face-apex", name: "Вершина", desc: "Точка, в якій зходяться всі твірні конуса." },
      { key: "face-base", name: "Основа", desc: "Кругла плоска грань знизу конуса." },
      { key: "face-side", name: "Бічна поверхня", desc: "Крива поверхня від вершини до кола основи. Розгортка — сектор круга." },
    ],
    realObject: "дорожній конус",
    lifeExplanation: "Конус можна побачити у дорожніх конусах, ріжках морозива та святкових ковпаках.",
    task: "Порівняй конус і циліндр з однаковим радіусом та висотою.",
    effectExplanation: "Об'єм конуса дорівнює третині об'єму циліндра з такою самою основою та висотою.",
  },
  {
    id: "pyramid",
    name: "Піраміда",
    definition: "Має правильний n-кутник в основі та трикутні бічні грані, що сходяться у вершині.",
    controls: [
      { key: "sides", label: "Кількість сторін основи (n)", min: 3, max: 12, step: 1, hint: "Кількість сторін правильного многокутника основи." },
      { key: "base", label: "Сторона основи", min: 1, max: 8, step: 0.5, hint: "Основа — нижня грань, на якій стоїть піраміда." },
      { key: "height", label: "Висота", min: 1, max: 9, step: 0.5, hint: "Висота — перпендикуляр від вершини до центра основи." },
    ],
    volumeFormula: "V=\\frac{1}{3}S_{\\text{осн}}h",
    surfaceFormula: "S=S_{\\text{осн}}+\\frac{1}{2}Pl",
    allFormulas: [
      { label: "Об'єм", latex: "V = \\frac{1}{3}S_{\\text{осн}} \\cdot h" },
      { label: "Площа основи (n-кутник)", latex: "S_{\\text{осн}} = \\frac{na^2}{4}\\cot\\frac{\\pi}{n}" },
      { label: "Периметр основи", latex: "P = na" },
      { label: "Площа бічної поверхні", latex: "S_{\\text{біч}} = \\frac{1}{2}P \\cdot l = \\frac{na \\cdot l}{2}" },
      { label: "Площа повної поверхні", latex: "S = S_{\\text{осн}} + S_{\\text{біч}}" },
      { label: "Площа однієї бічної грані", latex: "S_{\\text{гр}} = \\frac{1}{2} a \\cdot l" },
      { label: "Радіус вписаного кола основи", latex: "r = \\frac{a}{2\\tan\\frac{\\pi}{n}}" },
      { label: "Радіус описаного кола основи", latex: "R = \\frac{a}{2\\sin\\frac{\\pi}{n}}" },
      { label: "Апофема піраміди", latex: "l = \\sqrt{r^2 + h^2} = \\sqrt{\\left(\\frac{a}{2\\tan\\frac{\\pi}{n}}\\right)^2 + h^2}" },
      { label: "Бокове ребро", latex: "b = \\sqrt{R^2 + h^2} = \\sqrt{\\left(\\frac{a}{2\\sin\\frac{\\pi}{n}}\\right)^2 + h^2}" },
      { label: "Висота через об'єм", latex: "h = \\frac{3V}{S_{\\text{осн}}}" },
      { label: "Переріз паралельно основі на висоті y", latex: "S_{\\text{пер}} = S_{\\text{осн}}\\left(1 - \\frac{y}{h}\\right)^2" },
    ],
    elements: [
      { key: "a", name: "Сторона основи", desc: "Довжина ребра правильного многокутника основи піраміди." },
      { key: "h", name: "Висота", desc: "Перпендикуляр від вершини до центра основи." },
      { key: "l", name: "Апофема", desc: "Висота бічної грані, проведена від вершини піраміди до середини ребра основи." },
      { key: "b", name: "Бокове ребро", desc: "Відрізок від вершини піраміди до вершини основи." },
      { key: "R", name: "Радіус описаного кола", desc: "Радіус кола, що проходить через усі вершини основи." },
      { key: "r", name: "Радіус вписаного кола", desc: "Радіус кола, вписаного в основу, що дотикається середин сторін." },
      { key: "face-apex", name: "Вершина", desc: "Точка, в якій зходяться всі бічні грані піраміди." },
      { key: "face-base", name: "Основа", desc: "Правильний многокутник знизу піраміди." },
      { key: "face-side", name: "Бічна грань", desc: "Трикутна грань від ребра основи до вершини. Їх кількість дорівнює n." },
    ],
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
    allFormulas: [
      { label: "Об'єм", latex: "V = S_{\\text{осн}} \\cdot h" },
      { label: "Площа основи", latex: "S_{\\text{осн}} = \\frac{\\sqrt{3}}{4}a^2" },
      { label: "Площа повної поверхні", latex: "S = 2S_{\\text{осн}} + 3ah" },
      { label: "Площа бічної поверхні", latex: "S_{\\text{біч}} = 3ah" },
      { label: "Площа бічної грані", latex: "S_{\\text{біч.гр}} = ah" },
      { label: "Периметр основи", latex: "P = 3a" },
      { label: "Висота основи (трикутника)", latex: "h_{\\text{осн}} = \\frac{a\\sqrt{3}}{2}" },
      { label: "Радіус описаного кола основи", latex: "R = \\frac{a\\sqrt{3}}{3}" },
      { label: "Радіус вписаного кола основи", latex: "r = \\frac{a\\sqrt{3}}{6}" },
      { label: "Діагональ бічної грані", latex: "d = \\sqrt{a^2 + h^2}" },
      { label: "Переріз паралельно основі", latex: "S_{\\text{пер}} = S_{\\text{осн}} = \\frac{\\sqrt{3}}{4}a^2" },
      { label: "Переріз через бічне ребро перпендикулярно основі", latex: "S_{\\text{пер}} = ah" },
    ],
    elements: [
      { key: "a", name: "Сторона основи", desc: "Довжина ребра рівностороннього трикутника основи." },
      { key: "h", name: "Висота", desc: "Відстань між двома трикутними основами призми." },
      { key: "face-base", name: "Основа", desc: "Рівносторонній трикутник зверху або знизу призми." },
      { key: "face-side", name: "Бічна грань", desc: "Прямокутна грань, що з'єднує дві основи. У трикутної призми їх 3." },
    ],
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
      return { sides: 4, base: 4, height: 5 };
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
      const { sides: n, base: a, height: h } = params;
      const baseArea = (n * a ** 2) / (4 * Math.tan(Math.PI / n));
      const ri = a / (2 * Math.tan(Math.PI / n));
      const apothem = Math.sqrt(ri ** 2 + h ** 2);
      const lateralArea = (n * a * apothem) / 2;
      return { volume: (baseArea * h) / 3, surfaceArea: baseArea + lateralArea };
    }
    case "prism": {
      const { base: a, height: h } = params;
      const baseArea = (Math.sqrt(3) / 4) * a ** 2;
      return { volume: baseArea * h, surfaceArea: 2 * baseArea + 3 * a * h };
    }
  }
}
