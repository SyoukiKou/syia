/**
 * Concerts - SYIA Portfolio
 *
 * コンサート情報はこのファイル1つにまとめています。ここを書き換えるだけで
 *   ・Concert ページの一覧と、各公演の詳細（concert#id で開きます）
 *   ・Information ページの一覧（年で絞り込み）
 *   ・全ページのメニューに出る新着3件
 * がすべて更新されます。HTML を編集する必要はありません。
 *
 * ■ 新しい公演を追加するには
 *   1. 画像を images/ に入れる（例: images/showcase202611-cover.jpg、images/showcase202611-01.jpg）
 *   2. 下の「window.SYIA_CONCERTS = [」のすぐ後ろに、このひな形をコピーして書き換える
 *      （一覧はいつも日付の新しい順に並ぶので、どこに書いても大丈夫です）
 *
 *   {
 *     id: 'showcase202611',              // 公演ページの名前。半角英数字とハイフン（concert#showcase202611）
 *     date: '2026-11-14',                // 公演日（何日かあるときは初日）。2026.11/14 (Sat) と表示。並び順にも使います
 *     dateEnd: '2026-11-28',             // 省略可。何日かにわたるときの最終日（2026.11/14 (Sat) – 11/28 (Sat) と表示）
 *     title: '○○ 出演のお知らせ',
 *     titleEn: 'Performing at ○○',       // メニューで en を選んだときのタイトル
 *     venue: '会場名',                    // 省略可。一覧に小さく出ます
 *     cover: 'images/showcase202611-cover.jpg',   // 一覧のサムネイル（横長がきれいです）
 *     body: `
 *   ここに本文（書き方は下）
 *   `
 *   },
 *
 * ■ 本文の書き方（body: ` と ` のあいだ）
 *   空行で段落を区切ります。段落の中の改行はそのまま改行になります。空行を2つ続けると少し広く空きます。
 *
 *   ![画像の説明](images/xxx.jpg)        画像（1行に2枚以上並べると横並び）
 *   ## 《公演情報》                      見出し
 *   ### Violin & Piano Showcase          小見出し
 *   #### 🎻 ヴァイオリン楽器体験会        小さな見出し
 *   ※お席には限りがございます。         ※で始まる段落は小さな注記
 *   [公演詳細はこちら](https://...)      1行だけのリンクはボタン（続けて書くと横並び）
 *   文中の[リンク](https://...)           文の中のリンク
 *   <small>小さな文字</small>             文の一部だけ小さく
 *   ---                                  区切り線
 *   @map https://www.google.com/maps/embed?pb=...   Google マップ（「共有」→「地図を埋め込む」に出る src の URL）
 *   @youtube https://www.youtube.com/embed/...      YouTube（「共有」→「埋め込む」に出る src の URL）
 *   @columns … @next … @end              2段組（スケジュールなど。@next で次の段へ）
 *   @profile images/xxx.jpg              出演者紹介。次の行に「### 名前」、続けて紹介文、最後に @end
 *
 *   本文の中で ` （バッククォート）は使えません。
 */
window.SYIA_CONCERTS = [
  {
    id: "wial2026",
    date: "2026-10-24",
    title: "WIAL グローバルカンファレンス 2026 JAPAN ガラディナー 出演のお知らせ",
    titleEn: "Performed at the gala dinner of WIAL Global Conference 2026 Japan",
    venue: "SHIBUYA QWS（渋谷スクランブルスクエア 15F）",
    cover: "images/wial2026-cover.png",
    body: `
2026年10月24日（土）、WIAL グローバルカンファレンス 2026 JAPAN ガラディナー 出演のお知らせ

## 《公演情報》

### WIAL グローバルカンファレンス 2026 JAPAN ガラディナー

2026年10月24日（土）18:00〜20:00

＠SHIBUYA QWS（渋谷スクランブルスクエア 15F）

Violin : SYIA

[カンファレンス公式サイト](https://www.jial.or.jp/conference2026/index_ja.html)

@map https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.752713122077!2d139.699687175513!3d35.658463772594565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188bf0e52915ab%3A0x1ba65e8db4ca1d0e!2zU0hJQlVZQSBRV1Mg77yI5riL6LC344Kt44Ol44O844K677yJ!5e0!3m2!1sja!2sjp!4v1768907432899!5m2!1sja!2sjp
`
  },

  {
    id: "showcase202603",
    date: "2026-03-22",
    title: "Violin & Piano Showcase 出演のお知らせ",
    titleEn: "Performing at Violin & Piano Showcase",
    venue: "メズム東京 16階ロビー",
    cover: "images/showcase202603-cover.jpg",
    body: `
![Violin & Piano Showcase](images/showcase202603-01.jpg)

いつも温かいご声援を賜り、誠にありがとうございます。

このたび、メズム東京にて、Violin & Piano Showcaseに出演させていただく運びとなりました。

今宵は、映画音楽から本格的なクラシック・ソナタまで、ストーリー性溢れる選曲で、
聴く人の脳と心に深く響く音色を奏でます。

## 《公演情報》

### Violin & Piano Showcase

2026年3月22日(日曜)
第1部：19:00〜　第2部：20:30〜

＠メズム東京 16階ロビー

Violin : 黄松毅
Piano : 松谷萌花

※お席をご利用される方は、必ずご飲食のご注文をお願いいたします。
※お席には限りがございます。

### 【プログラム】

坂本龍一 / 戦場のメリークリスマス
山崎まさよし / 『秒速5センチメートル』主題歌
松任谷由実 / 春よ、来い
リスト / 愛の夢 第3番
パガニーニ / カンタービレ ニ長調 Op.17
J.S.バッハ・グノー / アヴェ・マリア
ジョン・ウィリアムズ / シンドラーのリストのテーマ
フランク / ヴァイオリン・ソナタ イ長調 第4楽章

[公演詳細はこちら](https://www.mesm.jp/experience/showcase/2026/03/20260322.html)

@map https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.8543293841767!2d139.76030277556856!3d35.65596047259547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b844cf9914f%3A0x496e9f1c0007b0ee!2z44CSMTA1LTAwMjIg5p2x5Lqs6YO95riv5Yy65rW35bK477yR5LiB55uu77yR77yQ4oiS77yT77yQ!5e0!3m2!1sja!2sjp!4v1743940719977!5m2!1sja!2sjp
`
  },

  {
    id: "violin-piano-showcase",
    date: "2026-01-29",
    title: "Regulative Art Experience 体験会のお知らせ",
    titleEn: "Regulative Art Experience: hands-on session",
    venue: "SHIBUYA QWS CROSS PARK",
    cover: "images/violin-piano-showcase-cover.png",
    body: `
![Regulative Art Experience](images/violin-piano-showcase-01.png)

弦楽四重奏の生演奏と共に、今ここで生じていることを知覚し、

ストレスマネジメントやWell-beingにつながる90分。


ただ聴いて終わる音楽ではない、内面へのアプローチを通じて生まれる、

新しい双方向型の芸術体験を届けます。

## 《開催詳細》

### 【新しい芸術体験のかたち】Regulative Art Experience

2026年1月29日(木)
19:00〜20:30　<small>※開場 18:30</small>

SHIBUYA QWS CROSS PARK
(住所：東京都渋谷区渋谷二丁目24番12号 · 渋谷スクランブルスクエア 15階）

参加費: 無料

Violin : 黄松毅
Violin : 上杉未宇
Viola : 細貝柚希奈
Cello : 小守林英希

[申し込み・詳細はこちら](https://thehearthjapan.peatix.com/view)

### 【体験コンテンツ】

#### 🎵生演奏で体感するRegulative Art Experience

芸術体験を通じて、心身の状態（注意・感覚・緊張）を自ら調整する力を取り戻す

#### 🎻 ヴァイオリン楽器体験会

実際にバイオリンに触れ、音を出す体験を通じて、
音楽=遠くから鑑賞するものではなく、より身近なものに感じていただけます。

#### 💬 QWS開催限定！問いを起点としたミニワークショップ

芸術に関係する問いをテーマに、参加者同士で考え、対話する時間を設けます。

### 【こんな方におすすめ】

・ストレスを感じている(他人と比較してしまう、プレッシャーに感じるなど）

・在宅ワークや長時間同じ姿勢が続くことで自律神経の乱れを感じる

・疲労を感じる

### 【ワークショップで得られること】

・「今」の自分にとってより適切な状態に心身が整う

・人生においてより適切な行動がとれる

・感性を高める実践的なアプローチが身に付く

・参加者同士の対話を通じた新たな気づきが得られる

[申し込み・詳細はこちら](https://thehearthjapan.peatix.com/view)

@map https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.752713122077!2d139.699687175513!3d35.658463772594565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188bf0e52915ab%3A0x1ba65e8db4ca1d0e!2zU0hJQlVZQSBRV1Mg77yI5riL6LC344Kt44Ol44O844K677yJ!5e0!3m2!1sja!2sjp!4v1768907432899!5m2!1sja!2sjp
`
  },

  {
    id: "showcase20251222",
    date: "2025-12-22",
    title: "BLUE FANTASY Special Showcase 出演のお知らせ",
    titleEn: "Performing at BLUE FANTASY Special Showcase",
    venue: "メズム東京 16階ロビー",
    cover: "images/showcase20251222-cover.jpg",
    body: `
![BLUE FANTASY Special Showcase](images/showcase20251222-01.jpg)

いつも温かいご声援を賜り、誠にありがとうございます。

このたび、メズム東京にて、BLUE FANTASY Special Showcase に出演させていただく運びとなりました。

バー＆ラウンジ「ウィスク」では、ホリデーシーズンの余韻を華やかに演出する期間限定カクテルもご用意いたします。

音楽と共に特別なひとときをお楽しみください。

## 《公演情報》

### BLUE FANTASY Special Showcase

2025年12月22日(月曜)
20:30〜21:00

＠メズム東京 16階ロビー

Violin : SYIA
Violin : Miu
Piano : Fumio

※お席をご利用される方は、必ずご飲食のご注文をお願いいたします。
※お席には限りがございます。

[公演詳細はこちら](https://www.mesm.jp/experience/showcase/2025/12/20251222.html)

@map https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.8543293841767!2d139.76030277556856!3d35.65596047259547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b844cf9914f%3A0x496e9f1c0007b0ee!2z44CSMTA1LTAwMjIg5p2x5Lqs6YO95riv5Yy65rW35bK477yR5LiB55uu77yR77yQ4oiS77yT77yQ!5e0!3m2!1sja!2sjp!4v1743940719977!5m2!1sja!2sjp

![BLUE FANTASY Special Showcase フライヤー](images/showcase20251222-02.png)
`
  },

  {
    id: "msp2025winter",
    date: "2025-11-22",
    dateEnd: "2025-12-25",
    title: "Marunouchi Street Park 2025 winter ストリート演奏のお知らせ",
    titleEn: "Street performances at Marunouchi Street Park 2025 winter",
    venue: "丸の内仲通り",
    cover: "images/msp2025winter-cover.jpg",
    body: `
![Marunouchi Street Park 2025 winter](images/msp2025winter-01.jpg)

いつも暖かいご声援をありがとうございます！

おかげさまで、丸の内での演奏は今冬で8シーズン目を迎えます。


今回も、美しいイルミネーションのもとで、心温まる冬の音楽をお届けします。

ぜひ暖かくして、特別なひとときをお楽しみください。

## 《演奏スケジュール》

@columns
### SYIA×Fumio×Miu×Kotone

11月22日（土） 19:15～19:50　@Block1

12月6日（土） 19:15～19:50　@Block2

12月7日（日） 19:15～19:50　@Block3

12月14日（日） 19:15～19:50　@Block5

12月21日（日） (雨天中止)
@next
### SYIA×Sasuke×Kanade

12月23日（火） 18:15～18:50　@Block4

12月25日（木） (雨天中止)
@end

## 《演奏場所》

丸の内仲通り

Block1：丸ビル・郵船ビル・三菱商事ビル前
Block2：丸の内二丁目ビル・丸の内仲通りビル前
Block3：丸の内パークビル・明治安田生命ビル前
Block4：新東京ビル・丸の内二重橋ビル前
Block5：新国際ビル・国際ビル前

演奏場所の変更につきましては、当日[instagram](https://www.instagram.com/syiaviolin/)のストーリーにてご案内いたします。

また[丸の内公式サイト](https://marunouchi-streetpark.com/)もご確認ください。

[Instagram](https://www.instagram.com/syiaviolin/)
[丸の内公式サイト](https://marunouchi-streetpark.com/)

@map https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.864696659717!2d139.7602214762516!3d35.680333430022515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b39eb095801%3A0x64a29f9f2f81d5f7!2z5Li444Gu5YaF5Luy6YCa44KK!5e0!3m2!1sja!2sjp!4v1762265412780!5m2!1sja!2sjp

## 《プログラムについて》

毎回の演奏でプログラムを変えております。

当日のプログラムは以下からご覧いただけます。

※当日更新

[プログラム](https://thehearth.jp/msm2025winter)

## 《曲のリクエストについて》

今回のストリート演奏では曲のリクエストを受け付けております！

お気軽に以下からご記入ください。

[曲リクエスト](https://docs.google.com/forms/d/e/1FAIpQLSfDVEGF999CtFaJbRDoOIhTqd4Ak0HCGxTrGEpf3YgjDlIaoQ/viewform?usp=dialog)

---

お問い合わせはこちら

[Contact](contact)
`
  },

  {
    id: "showcase202510",
    date: "2025-10-30",
    title: "\"ブエノスアイレスの四季\" Showcase 出演のお知らせ",
    titleEn: "Performing at \"The Four Seasons of Buenos Aires\" Showcase",
    venue: "メズム東京 16階ロビー",
    cover: "images/showcase202510-cover.jpg",
    body: `
!["ブエノスアイレスの四季" Showcase](images/showcase202510-01.jpg)

いつも温かいご声援を賜り、誠にありがとうございます。

今回のshowcaseで取り上げる《ブエノスアイレスの四季》は、ピアソラが伝統的な「四季」という概念に、タンゴのリズムと都会の熱気を融合させた作品です。

本公演を通じて、皆さまとともに「四季を生きる喜び」と「音楽が紡ぐ共感の力」を分かち合いたいと願っています。

ご多用のこととは存じますが、足をお運びいただけましたら幸いです。

## 《公演情報》

### "ブエノスアイレスの四季" Showcase

2025年10月30日(木)
第1部：19:00〜　第2部：20:30〜

＠メズム東京 16階ロビー

Violin : SYIA
Cello : 荒木匠登
Piano : 若井冴介

※お席をご利用される方は、必ずご飲食のご注文をお願いいたします。
※お席には限りがございます。

[公演詳細はこちら](https://www.mesm.jp/experience/showcase/2025/10/20251030.html)

@map https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.8543293841767!2d139.76030277556856!3d35.65596047259547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b844cf9914f%3A0x496e9f1c0007b0ee!2z44CSMTA1LTAwMjIg5p2x5Lqs6YO95riv5Yy65rW35bK477yR5LiB55uu77yR77yQ4oiS77yT77yQ!5e0!3m2!1sja!2sjp!4v1743940719977!5m2!1sja!2sjp

## 《共演者紹介》

@profile images/showcase202510-02.jpg
### 荒木匠登 (Vc)
渋谷教育学園幕張高等学校を経て東京音楽大学を卒業。


ザルツブルク＝モーツァルト国際室内楽コンクールin Tokyo 2023 特別賞。


ゲームやアニメ、映画の音楽を敬愛し、現在はそれらの公式コンサートへの出演やレコーディングへの参加、音楽教室での指導など幅広い音楽活動を続けている。
@end

@profile images/showcase202510-03.jpg
### 若井冴介 (Pf)
5歳からピアノを始める。


2018年PTNAピアノコンペティションにてE級ベスト賞。


その後大学サークルでの演奏、丸の内仲通りでの野外演奏、YouTube活動を通じてピアノに親しみ続ける
@end
`
  },

  {
    id: "showcase202509",
    date: "2025-09-14",
    title: "\"偉大な芸術家の思い出\" Showcase 出演のお知らせ",
    titleEn: "Performing at \"In Memory of a Great Artist\" Showcase",
    venue: "メズム東京 16階ロビー",
    cover: "images/showcase202509-cover.jpg",
    body: `
!["偉大な芸術家の思い出" Showcase](images/showcase202509-01.jpg)

いつも温かいご声援を賜り、誠にありがとうございます。

このたび、メズム東京のShowcaseにて、ピアノトリオの名曲、チャイコフスキー作曲《偉大な芸術家の思い出》を演奏させていただく運びとなりました。

この作品は、チャイコフスキーが敬愛してやまなかったピアニスト、ニコライ・ルビンシテインの死を悼み、その深い悲しみと感謝の思いを込めて作曲されたものです。第1楽章では追憶と敬意が静かに語られ、第2楽章では彼との思い出が変奏曲として色とりどりに描かれ、終楽章では魂の別れと永遠の余韻が胸を打ちます。

今回は第1楽章とその他小品の演奏を予定しています。

ご多用のこととは存じますが、足をお運びいただけましたら幸いです。

## 《公演情報》

### "偉大な芸術家の思い出" Showcase

2025年9月14日(日曜)
第1部：19:00〜　第2部：20:30〜

＠メズム東京 16階ロビー

Violin : SYIA
Cello : CARO
Piano : 高橋優希

※お席をご利用される方は、必ずご飲食のご注文をお願いいたします。
※お席には限りがございます。

[公演詳細はこちら](https://www.mesm.jp/experience/showcase/2025/09/20250914.html)

@map https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.8543293841767!2d139.76030277556856!3d35.65596047259547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b844cf9914f%3A0x496e9f1c0007b0ee!2z44CSMTA1LTAwMjIg5p2x5Lqs6YO95riv5Yy65rW35bK477yR5LiB55uu77yR77yQ4oiS77yT77yQ!5e0!3m2!1sja!2sjp!4v1743940719977!5m2!1sja!2sjp

## 《共演者紹介》

@profile images/showcase202509-02.jpg
### 高橋優希(Pf)
2002年生まれ。5歳よりピアノを始める。加藤公見子氏に師事。

第24回ショパン国際ピアノコンクールin ASIA アジア大会 大学生部門 金賞受賞。第1回・第2回全国大学生ピアノ選手権 準グランプリ連続受賞。国際アマチュアピアノコンクール2021 第2位及び杉並区長賞受賞。大学時代に2度のコンサートを開催。

東京大学経済学部経済学科卒業。社会人の傍らピアノを演奏する。
@end

@profile images/showcase202509-03.jpg
### CARO (Vc)
3歳よりチェロを始める。

佐藤明氏に師事し、基礎から音楽的表現まで幅広く学ぶ。

中高生時代にはSYIAとともに多数演奏を行う。

スズキ・メソード研究科を修了し、演奏技術と感性をさらに磨く。
@end
`
  },

  {
    id: "fccj2025",
    date: "2025-09-13",
    title: "It's Saturday Night Live ! 出演のお知らせ",
    titleEn: "Performing at It's Saturday Night Live !",
    venue: "外国人記者クラブ THE MAIN BAR",
    cover: "images/fccj2025-cover.jpg",
    body: `
![It's Saturday Night Live !](images/fccj2025-01.jpg)

いつも温かいご声援を賜り、誠にありがとうございます。
このたび、外国人記者クラブ「THE MAIN BAR」にてディナーコンサートを開催する運びとなりました。

日本外国特派員協会（FCCJ）は、1945年の創設以来、世界へニュースを発信し続けてきた、世界で最も古く、最も権威ある記者クラブのひとつです。
国内外の首相や大統領をはじめ、政治家、企業人、さらに芸術・文化・スポーツなど各分野の国際的著名人が数多く訪れてきました。

普段はめったに立ち入ることのできない場所ですが、今回は特別にファンの皆様をご招待いたします。
お席をご用意しますので、ページ下部のフォームより必要事項をご記入くださいませ。

## 《公演情報》

### It's Saturday Night Live !

2025年9月13日(土曜) 18:30〜21:00

＠外国人記者クラブ THE MAIN BAR
(東京都千代田区丸の内3-2-3 丸の内二重橋ビル 5F)

Violin : SYIA
Piano : 近藤 奏
Piano : 高橋 優希
Cello : CARO

※ミュージックチャージ¥1000を頂戴しております。

## 《プログラム》

第一部
マスネ：タイスの瞑想曲
坂本龍一：戦場のメリークリスマス
久石譲：アシタカとサン
久石譲：Asian Dream Song
久石譲：風の通り道
アラン・メンケン：美女と野獣メドレー

第二部
チャイコフスキー：メロディー
サンサーンス：白鳥
ドビュッシー：月の光
ショパン：華麗なる大円舞曲
チャイコフスキー：ピアノトリオ【偉大な芸術家の思い出】

第三部
マックス・リヒター：四季

![It's Saturday Night Live ! フライヤー](images/fccj2025-02.png)

[本公演の詳細(英語のみ)](https://www.fccj.or.jp/event/its-saturday-nite-live-43)

@map https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.9710235849657!2d139.75869752578757!3d35.677715472588375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b8471483c75%3A0xa28377387ff70de4!2z5pel5pys5aSW5Zu954m55rS-5ZOh5Y2U5Lya!5e0!3m2!1sja!2sus!4v1754986841722!5m2!1sja!2sus

## 《出演者紹介》

@profile images/fccj2025-03.jpg
### SYIA (Vn)
中学2年生よりソロ活動を開始。

脳科学的視点と数理論的視点を融合させ、
芸術による感動体験の本質に迫る研究と表現を行う。


芸術家集団 The Hearth 代表
Marunouchi Street Park 公式ミュージシャン
東京六大学ピアノ連盟 第28代理事長
ラ・フォル・ジュルネ TOKYO 2023・2025に出演。


早稲田大学情報理工学科卒業。
現在はScienceTokyoにて、脳と芸術の関係性をテーマに研究を行っている。
@end

@profile images/fccj2025-04.jpg
### 近藤 奏 (Pf)
長野市出身。長野日本大学高等学校卒。
ピアノを青木かおり、小山香織、 後藤友香理の各氏に師事。


サンマルクカフェ静岡伊勢丹前店専属ピアニスト。


2021年 第 15 回ベーテン音楽コンクール全国大会第1位。
音楽活動が評価され2021年度静岡大学学長表彰を受賞。


2023年7月1日に開催された静岡大学管弦楽団第 109 回定期演奏会にてソリストを務めグリーグ/ピアノ協奏曲イ短調 Op.16 を演奏。


2023年 ベルリン・フィルハーモニー管弦楽団主催”Be Phil Orchestra”のメンバーとして11月26日に東京・サントリーホールにて開催された Be Phil オーケストラジャパン 公演に出演。


2024年の秋に長野、東京、静岡を巡るピアノリサイタル「現代鍵盤音楽の調べ」を開催。
@end

@profile images/fccj2025-05.jpg
### 高橋 優希(Pf)
2002年生まれ。5歳よりピアノを始める。加藤公見子氏に師事。

第24回ショパン国際ピアノコンクールin ASIA アジア大会 大学生部門 金賞受賞。第1回・第2回全国大学生ピアノ選手権 準グランプリ連続受賞。国際アマチュアピアノコンクール2021 第2位及び杉並区長賞受賞。大学時代に2度のコンサートを開催。

東京大学経済学部経済学科卒業。社会人の傍らピアノを演奏する。
@end

@profile images/fccj2025-06.jpg
### CARO (Vc)
3歳よりチェロを始める。

佐藤明氏に師事し、基礎から音楽的表現まで幅広く学ぶ。

中高生時代にはSYIAとともに多数演奏を行う。

スズキ・メソード研究科を修了し、演奏技術と感性をさらに磨く。
@end

## 《ご予約フォーム》

※本公演のご予約受付は終了しました。
`
  },

  {
    id: "msp2025summer",
    date: "2025-09-06",
    dateEnd: "2025-09-21",
    title: "Marunouchi Street Park 2025 summer ストリート演奏のお知らせ",
    titleEn: "Street performances at Marunouchi Street Park 2025 summer",
    venue: "丸の内仲通り",
    cover: "images/msp2025summer-cover.jpg",
    body: `
![Marunouchi Street Park 2025 summer](images/msp2025summer-01.jpg)

Marunouchi Street Park開催期間中、今年もMarunouchi Street Musicを開催します✨

心地よい夏の夜風の中、生演奏の音楽を楽しみながら開放的なひとときを過ごしてみませんか？

お仕事帰りやお出かけのついでに、ぜひお気軽にお立ち寄りください。

## 《演奏スケジュール》

@columns
### SYIA×Fumio×Miu×Kotone

9/6(土)17:15-17:50

9/7(日)17:15-17:50

9/20(土)17:15-17:50

9/21(日)13:15-13:50
@next
### SYIA×Sasuke×Kanade

9/13(土)13:15-13:50

9/14(日)13:15-13:50
@end

## 《演奏場所》

丸の内仲通り

Block1：丸ビル・郵船ビル・三菱商事ビル前
Block2：丸の内二丁目ビル・丸の内仲通りビル前
Block3：丸の内パークビル・明治安田生命ビル前
のいずれかで実施します

演奏場所の変更につきましては、当日[instagram](https://www.instagram.com/syia_0929vn)のストーリーにてご案内いたします。

また[丸の内公式サイト](https://marunouchi-streetpark.com/)もご確認ください。

## 《曲のリクエストについて》

今回のストリート演奏では曲のリクエストを受け付けております！

以下のフォームからご記入ください。

[曲リクエスト](https://docs.google.com/forms/d/e/1FAIpQLScYvyVcHqshLafvv39fxaz_Z6g1vQIF4pzDvbwEUA6R8jyuMw/viewform)

@map https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.864873640204!2d139.76022147556986!3d35.68032907258751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b39eb095801%3A0x64a29f9f2f81d5f7!2z5Li444Gu5YaF5Luy6YCa44KK!5e0!3m2!1sja!2sjp!4v1757165491571!5m2!1sja!2sjp
`
  },

  {
    id: "violin-duo-piano-showcase",
    date: "2025-08-03",
    title: "Violin Duo & Piano Showcase 出演のお知らせ",
    titleEn: "Performing at Violin Duo & Piano Showcase",
    venue: "メズム東京 16階ロビー",
    cover: "images/violin-duo-piano-showcase-cover.png",
    body: `
![Violin Duo & Piano Showcase](images/violin-duo-piano-showcase-01.jpg)

色々な想い、違いの壁を越えて感情と時間を共有できる音楽をこよなく愛する3人組。


この素晴らしい空間で、忘れられない特別なひと時をお過ごしいただけるよう

ロマンチックで心揺さぶるハーモニーをお届けいたします。

## 《公演情報》

### Violin Duo & Piano Showcase

2025年8月3日(日曜)
第1部：19:00〜　第2部：20:30〜

＠メズム東京 16階ロビー

Violin : SYIA
Violin : Miu
Piano : Fuka

※お席をご利用される方は、必ずご飲食のご注文をお願いいたします。
※お席には限りがございます。

[こちらから詳細をご確認いただけます](https://www.mesm.jp/experience/showcase/2025/08/20250803.html)

@map https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.8543293841767!2d139.76030277556856!3d35.65596047259547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b844cf9914f%3A0x496e9f1c0007b0ee!2z44CSMTA1LTAwMjIg5p2x5Lqs6YO95riv5Yy65rW35bK477yR5LiB55uu77yR77yQ4oiS77yT77yQ!5e0!3m2!1sja!2sjp!4v1743940719977!5m2!1sja!2sjp
`
  },

  {
    id: "showcase202505",
    date: "2025-05-11",
    title: "Violin Duo & Piano Showcase 出演のお知らせ",
    titleEn: "Performing at Violin Duo & Piano Showcase",
    venue: "メズム東京",
    cover: "images/showcase202505-cover.jpg",
    body: `
![Violin Duo & Piano Showcase](images/showcase202505-01.jpg)

いつも温かいご声援をありがとうございます。
新年度、皆さまいかがお過ごしでしょうか。


私自身はこの4月より拠点を移し、「脳科学と芸術」をテーマに、本格的な研究生活をスタートいたしました。
それに伴い、演奏活動においても新たな挑戦を重ねてまいります。
今後の展開に、ぜひご期待ください。


さてこの度、メズム東京の Showcase にて、生演奏を披露させていただく運びとなりました。
洗練された空間で、ロマンチックで心を揺さぶるハーモニーをお届けいたします。
皆さまにとって、忘れがたい特別なひとときとなりますように

## 《公演情報》

### Violin Duo & Piano Showcase

2025年5月11日(日曜)
第1部：19:00〜　第2部：20:30〜

＠メズム東京

Violin : Miu
Violin : SYIA
Piano : Fumio

※お席をご利用される方は、必ずご飲食のご注文をお願いいたします。
※お席には限りがございます。


以下公式サイトから詳細をご覧いただけます。

[メズム東京 公式サイト](https://www.mesm.jp/experience/showcase/2025/05/20250511.html)

@map https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3241.8543293841767!2d139.76030277556856!3d35.65596047259547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b844cf9914f%3A0x496e9f1c0007b0ee!2z44CSMTA1LTAwMjIg5p2x5Lqs6YO95riv5Yy65rW35bK477yR5LiB55uu77yR77yQ4oiS77yT77yQ!5e0!3m2!1sja!2sjp!4v1743940719977!5m2!1sja!2sjp
`
  },

  {
    id: "lfj2025",
    date: "2025-05-05",
    title: "ラ・フォル・ジュルネ TOKYO 2025 出演のお知らせ",
    titleEn: "Performing at La Folle Journée TOKYO 2025",
    venue: "新丸ビル1階 北西外構部",
    cover: "images/lfj2025-cover.jpg",
    body: `
![ラ・フォル・ジュルネ TOKYO 2025](images/lfj2025-01.jpg)

いつも応援ありがとうございます。

今年も素敵なご縁をいただき、ラ・フォル・ジュルネに出演させていただくことになりました。

今回は、緑あふれる開放的な憩いの空間へとリニューアルされた新丸ビル1階テラス近く、北西エントランスにて演奏いたします。

開放的なオープンエアの空間での演奏です。ぜひお立ち寄りください。

## 《公演情報》

### LFJエリアコンサート 新丸ビル1階

2025年5月5日(月・祝)
第1部：12:00〜　第2部：13:30〜

＠東京都千代田区丸の内1丁目5-1 新丸ビル1階 北西外構部

Violin : Miu
Violin : SYIA
Piano : 森下柚香


以下公式サイトから詳細をご覧いただけます。

[公式ホームページ](https://www.lfj.jp/lfj_2025/event/areaconcert/lfj/article_12.html)
`
  },

  {
    id: "msp2025spring",
    date: "2025-04-26",
    dateEnd: "2025-05-11",
    title: "Marunouchi Street Park 2025 spring ストリート演奏のお知らせ",
    titleEn: "Street performances at Marunouchi Street Park 2025 spring",
    venue: "丸の内仲通り",
    cover: "images/msp2025spring-cover.jpg",
    body: `
![Marunouchi Street Park 2025 spring](images/msp2025spring-01.jpg)

いつも温かいご声援をありがとうございます。
おかげさまで、丸の内での演奏はこの春で6期目を迎えることができました。


今回も、春の訪れとともに、心やすらぐ音楽をお届けいたします。
暖かな空気に包まれながら、特別なひとときをどうぞお楽しみください。

## 《演奏スケジュール》

## SYIA×Fumio×Miu×Kotone

4月26日(土) 13:00～14:00

5月11日(日) 14:00～15:00

## 《演奏場所》

丸の内仲通り

Block1：丸ビル・郵船ビル・三菱商事ビル前
Block2：丸の内二丁目ビル・丸の内仲通りビル前
Block3：丸の内パークビル・明治安田生命ビル前

@map https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.8755027474162!2d139.76027757556986!3d35.68006737258753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188b0050b297c7%3A0x3c9a70333caac53f!2sMarunouchi%20Street%20Park!5e0!3m2!1sja!2sjp!4v1743942275942!5m2!1sja!2sjp

演奏場所の変更につきましては、当日[instagram](https://www.instagram.com/syia_0929vn)のストーリーにてご案内いたします。

また[丸の内公式サイト](https://marunouchi-streetpark.com/)もご確認ください。

## 《曲のリクエストについて》

今回のストリート演奏では曲のリクエストを受け付けております！

お気軽に以下のフォームからご記入ください。

※曲リクエストの受付は終了しました。
`
  },

  {
    id: "39-2025",
    date: "2025-03-09",
    title: "《卒業前最終公演》早稲田大学卒業記念リサイタル開催のお知らせ",
    titleEn: "Waseda University graduation recital",
    venue: "早稲田大学村上春樹ライブラリー 地下1階カフェ 橙子猫-Orange Cat-",
    cover: "images/39-2025-cover.jpg",
    body: `
![《卒業前最終公演》早稲田大学卒業記念リサイタル](images/39-2025-01.jpg)

いつも応援してくださり、ありがとうございます。
私SYIAは、2025年3月で早稲田大学を卒業します。

これまでお世話になった皆様への感謝を込めて、卒業記念リサイタルを開催することになりました。
お忙しいとは思いますが、ぜひお越しいただけたら嬉しいです。

## 《公演情報》

### ワセダの音楽家を育てるコンサート 第四弾

presented by 橙子猫


2025年 3月9日 (日曜日)
15:00〜16:00

violin:SYIA
piano:Sasuke

入場無料

＠早稲田大学村上春樹ライブラリー 地下1階カフェ 橙子猫-Orange Cat-

### Program

マスネ / タイスの瞑想曲
坂本龍一 / 戦場のメリークリスマス
アラン・メンケン / 美女と野獣
バッハ / アヴェ・マリア
ドヴォルザーク / 4つのロマンティックな小品 第1曲
シュトラウス / ヴァイオリンソナタ 第3楽章

※予告なしに変更する場合がございます。

![早稲田大学卒業記念リサイタル フライヤー（表）](images/39-2025-02.jpg)

![早稲田大学卒業記念リサイタル フライヤー（裏）](images/39-2025-03.jpg)

@map https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6479.340915749685!2d139.71732567557123!3d35.709726272578145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188d235e6cd57f%3A0xad815d019a662457!2z5pep56iy55Sw5aSn5a2m5Zu96Zqb5paH5a2m6aSoIOadkeS4iuaYpeaoueODqeOCpOODluODqeODquODvA!5e0!3m2!1sja!2sjp!4v1739258895465!5m2!1sja!2sjp
`
  },

  {
    id: "iss2024",
    date: "2024-12-24",
    title: "Bright Street Ice Skating Show 生演奏出演のお知らせ",
    titleEn: "Live performance at Bright Street Ice Skating Show",
    venue: "東京駅前 行幸通り",
    cover: "images/iss2024-cover.jpg",
    body: `
![Bright Street Ice Skating Show](images/iss2024-01.jpg)

いつも暖かいご声援をありがとうございます！

本イベントは今年初めての試みになります。


今年のクリスマスイブは、夢のようなスケートショーで生演奏を披露する機会をいただきました。

ご家族や大切な方とともに、丸の内で特別なひとときをお過ごしください。

## 《公演情報》

### Bright Street Ice Skating Show

presented by Marunouchi Street Park 2024 winter


12月24日(火曜)
第1部：16:00〜　第2部：18:00〜

＠東京駅前 行幸通り


※当日はスケートリンクサイドからご観覧いただけます

※雨天時は中止となります。

※開催時間は変更になる可能性もございます。

※有料席と無料席がございます。

以下公式サイトから詳細をご覧いただけます。

[Marunouchi Street Rink 公式サイト](https://marunouchi-street-rink.com/)

---

その他お問い合わせは下記へ

[Contact](contact)
`
  },

  {
    id: "msp2024winter",
    date: "2024-11-24",
    dateEnd: "2024-12-25",
    title: "Marunouchi Street Park 2024 winter ストリート演奏のお知らせ",
    titleEn: "Street performances at Marunouchi Street Park 2024 winter",
    venue: "丸の内仲通り",
    cover: "images/msp2024winter-cover.jpg",
    body: `
![Marunouchi Street Park 2024 winter](images/msp2024winter-01.jpg)

いつも暖かいご声援をありがとうございます！

おかげさまで、丸の内での演奏は今冬で5期目を迎えます。


今回も、美しいイルミネーションのもとで、心温まる冬の音楽をお届けします。

ぜひ暖かくして、特別なひとときをお楽しみください。

## 《演奏スケジュール》

※出演時間に変更がございました。(24.12/19更新)

@columns
### SYIA×Fumio×Miu×Kotone

11月24日（日） 19:00～20:00

11月28日（木） 18:00～19:00

12月14日（土） 18:00～19:00

12月15日（日） 16:00～17:00 / 18:00～19:00

12月20日（金） 18:00～19:00　(SYIA不在)

12月22日（日） 17:00～18:00

12月22日（日） 19:00～20:00　(SYIA不在)
@next
### SYIA×Sasuke×Kanade

11月29日（金） 18:00～19:00

11月30日（土） 18:00～19:00

12月1日（日） 18:00～19:00

12月6日（金） 18:00～19:00

12月13日（金） 18:00～19:00

12月23日（月） 18:00～19:00

12月25日（水） 17:00～18:00
@end

## 《演奏場所》

丸の内仲通り

Block1 ：丸ビル前(12/23,25のみ)

Block4：新東京ビル・丸の内二重橋ビル前
Block5：新国際ビル・国際ビル前

![Marunouchi Street Park 2024 winter エリアマップ](images/msp2024winter-02.jpg)

## 《プログラムについて》

毎回の演奏でプログラムを変えております。

当日のプログラムは下のボタンからご覧いただけます。

※当日更新

[プログラム](https://syiaviolin.notion.site/SYIA-in-Marunouchi-71e728922e634f05a586106d8bf51338)

演奏場所の変更につきましては、当日[instagram](https://www.instagram.com/syia_0929vn)のストーリーにてご案内いたします。

また[丸の内公式サイト](https://marunouchi-streetpark.com/)もご確認ください。

## 《曲のリクエストについて》

今回のストリート演奏では曲のリクエストを受け付けております！

お気軽に以下のボタンからご記入ください。

[曲リクエスト](https://syiaviolin.notion.site/SYIA-Marunouchi-71e728922e634f05a586106d8bf51338?pvs=4)

---

その他お問い合わせは下記へ

[Contact](contact)
`
  },

  {
    id: "duo2023",
    date: "2023-09-24",
    title: "Duo Concert開催のお知らせ",
    titleEn: "Duo Concert",
    venue: "サロン・ヴェーラ",
    cover: "images/duo2023-cover.jpg",
    body: `
![Duo Concert フライヤー](images/duo2023-01.jpg)
`
  },

  {
    id: "lfj2023",
    date: "2023",
    title: "ラ・フォル・ジュルネ TOKYO 2023 出演のお知らせ",
    titleEn: "Performing at La Folle Journée TOKYO 2023",
    cover: "images/lfj2023-cover.jpg",
    body: `
いつも温かいご声援をありがとうございます！

素敵なご縁をいただき、今年の「ラ・フォル・ジュルネ TOKYO 2023」に出演いたしました。

今年のテーマはベートーヴェンということで、ヴァイオリンソナタ5番「春」を演奏しました。

今日の会場はコンサートホールとは異なる音の広がりがあり、新鮮でとても楽しい経験となりました。

@youtube https://www.youtube.com/embed/OtBgfojoTGA?start=92

![ラ・フォル・ジュルネ TOKYO 2023 での演奏の様子](images/lfj2023-01.jpg) ![ラ・フォル・ジュルネ TOKYO 2023 での演奏の様子](images/lfj2023-02.jpg)

[出演レポートはこちら](https://concert.piano.or.jp/news/2023/05/marunouchi2023_rp08.html)

---

その他お問い合わせは下記へ

[Contact](contact)
`
  }
];
