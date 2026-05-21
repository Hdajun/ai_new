export const CATEGORY_LABELS: Record<string, string> = {
  model: '模型发布',
  tool: '产品工具',
  industry: '行业动态',
  paper: '论文研究',
  opensource: '开源项目',
  viewpoint: '技巧观点'
}

export function getCategoryLabel(category?: string | null) {
  if (!category) return 'AI 动态'
  return CATEGORY_LABELS[category] || category
}
