export const CHINESE_THEMES = [
  { id: "family", label: "Family · 家人", characters: "爸妈爷奶男女姐妹哥弟儿家" },
  { id: "numbers", label: "Numbers · 数字", characters: "一二三四五六七八九十多少" },
  { id: "body", label: "Body · 身体", characters: "头发眼眉鼻耳口牙舌心手脚" },
  { id: "animals", label: "Animals · 动物", characters: "虫鸟牛马羊兔鱼龟猫狗虎象" },
  { id: "plants", label: "Plants · 植物", characters: "花草果叶桃梨豆竹菜瓜苗芽" },
  { id: "nature", label: "Nature · 自然", characters: "土田水火山石云星木林太阳" },
] as const;
export type ChineseTheme = typeof CHINESE_THEMES[number]["id"];
// First 50 entries, in order, from ltl-taiwan.com/traditional-chinese-characters-list/.
export const COMMON_CHINESE = [..."的一是不了人我在有他這中大來上國個到說們為子和你地出道也時年得就那要下以生會自著去之過家學對可她裡后"];
export const FAMILY_ROLES = [
  { role: "公公", side: "mum", generation: 0, picture: 2 },
  { role: "婆婆", side: "mum", generation: 0, picture: 3 },
  { role: "爺爺", side: "dad", generation: 0, picture: 2 },
  { role: "嫲嫲", side: "dad", generation: 0, picture: 3 },
  { role: "媽媽", side: "mum", generation: 1, picture: 1 },
  { role: "爸爸", side: "dad", generation: 1, picture: 0 },
  { role: "姨媽", side: "mum", generation: 1, picture: 1, age: "older" },
  { role: "姨姨", side: "mum", generation: 1, picture: 6, age: "younger" },
  { role: "舅父", side: "mum", generation: 1, picture: 0 },
  { role: "姑媽", side: "dad", generation: 1, picture: 1 },
  { role: "伯父", side: "dad", generation: 1, picture: 0 },
  { role: "叔叔", side: "dad", generation: 1, picture: 0 },
  { role: "我", side: "children", generation: 2, picture: 4 },
  { role: "哥哥", side: "children", generation: 2, picture: 8 },
  { role: "姐姐", side: "children", generation: 2, picture: 6 },
  { role: "弟弟", side: "children", generation: 2, picture: 9 },
  { role: "妹妹", side: "children", generation: 2, picture: 7 },
] as const;
export type FamilyRole = typeof FAMILY_ROLES[number]["role"];
export type FamilyMember = { id: string; role: FamilyRole; photo?: string; name?: string };
export const INITIAL_FAMILY: FamilyMember[] = FAMILY_ROLES.filter(m => ["公公", "婆婆", "爺爺", "嫲嫲", "媽媽", "爸爸", "我"].includes(m.role)).map(m => ({ id: m.role, role: m.role }));