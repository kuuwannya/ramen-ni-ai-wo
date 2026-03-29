import { NextRequest, NextResponse } from "next/server";

const ALL_SHOPS = [
  { id: 1,  name: "九州 筑豊ラーメン山小屋",       address: "佐賀県嬉野市嬉野町大字下宿甲４００２−４",       google_map_url: "https://maps.app.goo.gl/BvuQTxGsmKLJ68yL9" },
  { id: 2,  name: "博多ラーメン 一蘭",              address: "福岡県福岡市博多区博多駅前２−１",              google_map_url: "https://maps.app.goo.gl/example2" },
  { id: 3,  name: "熊本ラーメン 黒亭",              address: "熊本県熊本市中央区上通町１−１",              google_map_url: "https://maps.app.goo.gl/example3" },
  { id: 4,  name: "札幌ラーメン 白樺山荘",          address: "北海道札幌市中央区南5条西3丁目",             google_map_url: "https://maps.app.goo.gl/example4" },
  { id: 5,  name: "旭川ラーメン 蜂屋",              address: "北海道旭川市2条通8丁目",                    google_map_url: "https://maps.app.goo.gl/example5" },
  { id: 6,  name: "函館塩ラーメン まるかつ",        address: "北海道函館市若松町10−11",                  google_map_url: "https://maps.app.goo.gl/example6" },
  { id: 7,  name: "喜多方ラーメン 坂内",            address: "福島県喜多方市細田7230",                    google_map_url: "https://maps.app.goo.gl/example7" },
  { id: 8,  name: "東京ラーメン 影武者",            address: "東京都新宿区歌舞伎町1丁目2−3",             google_map_url: "https://maps.app.goo.gl/example8" },
  { id: 9,  name: "横浜家系 壱角家",               address: "神奈川県横浜市西区南幸2丁目1−1",           google_map_url: "https://maps.app.goo.gl/example9" },
  { id: 10, name: "尾道ラーメン 朱華園",            address: "広島県尾道市十四日元町4−12",               google_map_url: "https://maps.app.goo.gl/example10" },
  { id: 11, name: "長浜ラーメン 元祖長浜屋",        address: "福岡県福岡市中央区長浜2丁目5−25",          google_map_url: "https://maps.app.goo.gl/example11" },
  { id: 12, name: "鹿児島ラーメン 我流風",          address: "鹿児島県鹿児島市千日町6−11",               google_map_url: "https://maps.app.goo.gl/example12" },
  { id: 13, name: "仙台辛味噌ラーメン 辛みそ一番",  address: "宮城県仙台市青葉区一番町4丁目3−1",         google_map_url: "https://maps.app.goo.gl/example13" },
  { id: 14, name: "名古屋 台湾ラーメン 味仙",       address: "愛知県名古屋市千種区今池1丁目12−10",       google_map_url: "https://maps.app.goo.gl/example14" },
  { id: 15, name: "京都ラーメン 新福菜館",          address: "京都府京都市下京区東塩小路向畑町569",       google_map_url: "https://maps.app.goo.gl/example15" },
  { id: 16, name: "大阪ラーメン 金龍",             address: "大阪府大阪市中央区道頓堀1丁目7−26",        google_map_url: "https://maps.app.goo.gl/example16" },
  { id: 17, name: "徳島ラーメン いのたに",          address: "徳島県徳島市西大工町4丁目25",              google_map_url: "https://maps.app.goo.gl/example17" },
  { id: 18, name: "和歌山ラーメン 井出商店",        address: "和歌山県和歌山市田中町4丁目84",            google_map_url: "https://maps.app.goo.gl/example18" },
  { id: 19, name: "久留米ラーメン 大砲ラーメン",    address: "福岡県久留米市通外町11−8",                google_map_url: "https://maps.app.goo.gl/example19" },
  { id: 20, name: "宮崎ラーメン 万麺",             address: "宮崎県宮崎市橘通東3丁目1−1",             google_map_url: "https://maps.app.goo.gl/example20" },
  { id: 21, name: "新潟燕三条ラーメン 福来亭",      address: "新潟県燕市吉田下中野1234",                google_map_url: "https://maps.app.goo.gl/example21" },
  { id: 22, name: "富山ブラックラーメン 西町大喜",  address: "富山県富山市西町5−7",                     google_map_url: "https://maps.app.goo.gl/example22" },
  { id: 23, name: "高山ラーメン 豆天狗",            address: "岐阜県高山市本町1丁目46",                  google_map_url: "https://maps.app.goo.gl/example23" },
  { id: 24, name: "神戸ラーメン 第一旭",            address: "兵庫県神戸市中央区元町通1丁目7−2",        google_map_url: "https://maps.app.goo.gl/example24" },
  { id: 25, name: "広島つけ麺 ばくだん屋",          address: "広島県広島市中区本通8−28",                google_map_url: "https://maps.app.goo.gl/example25" },
  { id: 26, name: "岡山ラーメン 山富士",            address: "岡山県岡山市北区奉還町2丁目7−6",          google_map_url: "https://maps.app.goo.gl/example26" },
  { id: 27, name: "松山ラーメン 五志喜",            address: "愛媛県松山市三番町3丁目5−4",              google_map_url: "https://maps.app.goo.gl/example27" },
  { id: 28, name: "高知ラーメン 龍馬軒",            address: "高知県高知市帯屋町1丁目10−1",             google_map_url: "https://maps.app.goo.gl/example28" },
  { id: 29, name: "長崎ちゃんぽん 四海樓",          address: "長崎県長崎市松が枝町4−5",                 google_map_url: "https://maps.app.goo.gl/example29" },
  { id: 30, name: "佐賀ラーメン 一休軒",            address: "佐賀県佐賀市白山2丁目1−15",              google_map_url: "https://maps.app.goo.gl/example30" },
  { id: 31, name: "沖縄そば 首里そば",             address: "沖縄県那覇市首里赤田町1丁目3",            google_map_url: "https://maps.app.goo.gl/example31" },
  { id: 32, name: "青森煮干しラーメン 長尾中華そば", address: "青森県青森市古川1丁目15−6",               google_map_url: "https://maps.app.goo.gl/example32" },
  { id: 33, name: "盛岡冷麺 ぴょんぴょん舎",        address: "岩手県盛岡市盛岡駅前通8−11",             google_map_url: "https://maps.app.goo.gl/example33" },
  { id: 34, name: "秋田ラーメン 正直屋",            address: "秋田県秋田市大町3丁目2−7",               google_map_url: "https://maps.app.goo.gl/example34" },
  { id: 35, name: "山形ラーメン 龍上海",            address: "山形県山形市旅篭町3丁目4−41",            google_map_url: "https://maps.app.goo.gl/example35" },
  { id: 36, name: "水戸ラーメン 麺や食堂",          address: "茨城県水戸市宮町1丁目7−31",              google_map_url: "https://maps.app.goo.gl/example36" },
  { id: 37, name: "宇都宮餃子ラーメン 来らっせ",    address: "栃木県宇都宮市馬場通り4丁目2−3",         google_map_url: "https://maps.app.goo.gl/example37" },
  { id: 38, name: "前橋ラーメン からっ風",          address: "群馬県前橋市本町2丁目2−1",               google_map_url: "https://maps.app.goo.gl/example38" },
  { id: 39, name: "浜松ラーメン 春華秋実",          address: "静岡県浜松市中区田町226−2",              google_map_url: "https://maps.app.goo.gl/example39" },
  { id: 40, name: "金沢ラーメン 8番らーめん",       address: "石川県金沢市香林坊1丁目1−1",             google_map_url: "https://maps.app.goo.gl/example40" },
];

const PER_PAGE = 20;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

  const totalCount = ALL_SHOPS.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * PER_PAGE;
  const shops = ALL_SHOPS.slice(offset, offset + PER_PAGE);

  return NextResponse.json(
    { shops },
    {
      headers: {
        "Current-Page": String(currentPage),
        "Page-Items": String(PER_PAGE),
        "Total-Pages": String(totalPages),
        "Total-Count": String(totalCount),
      },
    }
  );
}
