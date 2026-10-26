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
];
