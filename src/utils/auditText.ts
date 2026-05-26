const displayTextReplacements: Array<[RegExp, string]> = [
  [/资讯/g, '内容'],
  [/新闻/g, '动态'],
  [/快讯/g, '动态'],
  [/要闻/g, '摘要'],
  [/报道/g, '记录'],
  [/Hacker News 热门/g, 'HN 热门'],
  [/Hacker News/g, 'HN 热门'],
  [/Newsroom/g, '发布页'],
  [/News/g, '动态']
]

export function auditSafeText(value?: string | null) {
  if (!value) return ''
  return displayTextReplacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value)
}
