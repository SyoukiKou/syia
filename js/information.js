/**
 * Information - SYIA Portfolio
 *
 * お知らせ（Information ページ）はこのファイルにまとめています。
 * 演奏会の告知は js/concerts.js に書くので、ここには入れません（Concert ページに並びます）。
 * メニューの新着3件には、お知らせと演奏会の両方から新しい順に出ます。
 *
 * ■ お知らせを追加するには
 *   下の「window.SYIA_INFORMATION = [」のすぐ後ろに、このひな形をコピーして書き換える
 *   （一覧はいつも日付の新しい順に並ぶので、どこに書いても大丈夫です）
 *
 *   {
 *     date: '2026-11-01',                      // 日付。2026.11/01 (Sun) と表示。並び順と年の絞り込みにも使います
 *     title: '公式サイトをリニューアルしました',
 *     titleEn: 'The official website has been renewed',   // メニューで en を選んだときのタイトル（省略可）
 *     text: '本文（省略可）。改行はそのまま反映されます。文中に[リンク](https://...)も書けます。',
 *     link: 'concert#showcase202611'      // 省略可。タイトルを押したときの行き先（外部サイトの URL も可）
 *   },
 */
window.SYIA_INFORMATION = [
  {
    date: '2026-11-05',
    title: 'Post-Classical Debussy 出演のお知らせ（11/14 美学校・11/28 100BANCH）',
    titleEn: 'Post-Classical Debussy: live on Nov 14 (Bigakko) and Nov 28 (100BANCH)',
    text: '五線をほどくと、絵が鳴りはじめる。\n' +
      '印象派の絵画とドビュッシーを、ヴァイオリン・電子音・映像で立ち上げ直すライブ「Post-Classical Debussy」に、ヴァイオリンで出演します。\n' +
      '\n' +
      '11/14（土）18:00〜19:00　美学校（東京都千代田区神田神保町2-20 第二富士ビル3F）\n' +
      'Live／ドビュッシー4曲の再構成ライブ　[参加フォーム](https://forms.gle/6oM4AJB4sHV5AhGM7)\n' +
      '\n' +
      '11/28（土）18:00〜19:00　100BANCH（東京都渋谷区渋谷3-27-1）\n' +
      'Listen to the Painting／ライブ＋絵画を聴く音声ガイド体験　[参加フォーム](https://docs.google.com/forms/d/e/1FAIpQLSf0sD5RV8oLNxYMkAP7YX2W0XOWYwlHeA9png0hFpC0zaabbQ/viewform)\n' +
      '\n' +
      'いずれも入場無料・予約不要です。チラシ・プログラムは[公演ページ](concert#debussy2026)をご覧ください。',
    link: 'concert#debussy2026'
  },
];
