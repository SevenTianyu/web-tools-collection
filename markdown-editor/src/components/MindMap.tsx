import { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { X, Download, Maximize2 } from 'lucide-react';
import { extractMindMapData } from '../utils/markdown';
import type { MindMapNode } from '../types';

interface MindMapProps {
  content: string;
  onClose: () => void;
}

export default function MindMap({ content, onClose }: MindMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const data = useMemo(() => extractMindMapData(content), [content]);
  
  useEffect(() => {
    if (!svgRef.current || !data) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const width = 1200;
    const height = 800;
    const margin = { top: 40, right: 120, bottom: 40, left: 120 };
    
    svg.attr('width', width).attr('height', height);
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // 创建树布局
    const treeLayout = d3.tree<MindMapNode>()
      .size([height - margin.top - margin.bottom, width - margin.left - margin.right]);
    
    // 转换数据为层级结构
    const root = d3.hierarchy(data, d => d.children);
    treeLayout(root);
    
    // 颜色方案
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const getColor = (depth: number) => colors[depth % colors.length];
    
    // 绘制连线
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'mind-map-link')
      .attr('d', d3.linkHorizontal<any, any>()
        .x(d => d.y)
        .y(d => d.x)
      )
      .attr('stroke', d => getColor(d.target.depth))
      .attr('stroke-width', d => Math.max(1, 3 - d.target.depth))
      .attr('fill', 'none');
    
    // 绘制节点
    const nodes = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'mind-map-node')
      .attr('transform', d => `translate(${d.y},${d.x})`);
    
    // 节点圆形背景
    nodes.append('circle')
      .attr('r', d => d.depth === 0 ? 25 : 18 - d.depth * 2)
      .attr('fill', d => d.depth === 0 ? '#3b82f6' : '#fff')
      .attr('stroke', d => getColor(d.depth))
      .attr('stroke-width', d => d.depth === 0 ? 0 : 2);
    
    // 节点文字
    nodes.append('text')
      .attr('dy', '0.35em')
      .attr('x', d => d.children ? -12 : 12)
      .attr('text-anchor', d => d.children ? 'end' : 'start')
      .text(d => {
        const text = d.data.text;
        return text.length > 20 ? text.substring(0, 20) + '...' : text;
      })
      .attr('font-size', d => d.depth === 0 ? '14px' : '12px')
      .attr('font-weight', d => d.depth === 0 ? 'bold' : 'normal')
      .attr('fill', d => d.depth === 0 ? '#fff' : '#374151');
    
    // 添加缩放行为
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    svg.call(zoom as any);
    
  }, [data]);
  
  const handleExport = () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mindmap.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        ref={containerRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl mx-4 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              思维导图
              <span className="text-xs font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                Beta
              </span>
            </h2>
            <p className="text-sm text-gray-500">基于文档标题结构自动生成</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="btn-secondary gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              导出 SVG
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gray-50 p-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 inline-block">
            <svg 
              ref={svgRef}
              className="w-full h-auto"
              style={{ minWidth: '800px', minHeight: '600px' }}
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
          <span>提示：可以使用鼠标滚轮缩放，拖拽移动画布</span>
          <span>共 {data.children?.length || 0} 个一级节点</span>
        </div>
      </div>
    </div>
  );
}
